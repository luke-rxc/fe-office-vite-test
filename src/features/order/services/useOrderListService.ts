import { SiteType } from '@constants/site';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useQueryState } from '@hooks/useQueryState';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { toDateFormat } from '@utils/date';
import { excelExport } from '@utils/excel';
import { addDays } from 'date-fns';
import concat from 'lodash/concat';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import {
  getOrderExcelItems,
  OrderParams,
  putOrderPaid,
  putOrderPaidByPartner,
  putOrderPreparingGoods,
  putOrderPreparingGoodsByPartner,
} from '../apis';
import {
  OrderDefaultSearchPage,
  ExcelDownloadType,
  OrderActionType,
  OrderExcelCode,
  OrderQueryKeys,
  OrderSearchFieldType,
  OrderStatus,
  OrderStatusAfterExportOptions,
  OrderStatusBeforeExportOptions,
  OrderDefaultSearchSize,
} from '../constants';
import { useBrandComboQuery, useOrderCommonMDComboQuery, useOrderListQuery, useProviderComboQuery } from '../hooks';
import {
  toOrderExcelItems,
  toOrderQueryStateBySearchFormField,
  toOrderSearchFormFieldByQueryState,
  toOrderSearchParamsByQueryState,
  toOrderStepStatus,
} from '../models';
import { OrderListQueryState, OrderListSearchParams, OrderSearchFormField, ParallelResponse } from '../types';

export type ReturnTypeUseOrderListService = ReturnType<typeof useOrderListService>;

export const useOrderListService = () => {
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const currentSiteType = useSiteType();
  const { showLoading, hideLoading } = useLoading();
  const isManager = currentSiteType === SiteType.MANAGER;

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [orderActionTypes, setOrderActionTypes] = useState<Array<OrderActionType>>([]);
  const { queryState, updateQueryState } = useQueryState<OrderListQueryState>();

  const defaultFormValues: OrderSearchFormField = {
    keyword: '',
    fromDate: toDateFormat(addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7)),
    toDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`)),
    searchType: OrderSearchFieldType.ORDER,
    orderStepList: concat(OrderStatusBeforeExportOptions, OrderStatusAfterExportOptions).map((_, index) => index === 0),
    goodsType: '',
    shippingMethod: '',
    provider: null,
    md: null,
    brand: null,
  };

  const onError = (targetName: string) => {
    return (error: ErrorModel) => {
      dialog.open({
        content: `${targetName} 문제가 발생하였습니다\r\n(${error.data.message})`,
        type: DialogType.ALERT,
      });
    };
  };

  const { data: providerCombo, isLoading: isLoadingProviderCombo } = useProviderComboQuery({
    enabled: isManager,
    onError: onError('주문 리스트 조회중'),
  });

  const { data: mdCombo, isLoading: isLoadingMDCombo } = useOrderCommonMDComboQuery({
    enabled: isManager,
    onError: onError('주문 리스트 조회중'),
  });

  const { data: brandCombo, isLoading: isLoadingBrandCombo } = useBrandComboQuery({
    enabled: isManager,
    onError: onError('주문 리스트 조회중'),
  });

  const { mutateAsync: requestOrderExcelItems } = useMutation((params: OrderListSearchParams) =>
    getOrderExcelItems(params),
  );

  const formMethod = useForm<OrderSearchFormField>({
    defaultValues: toOrderSearchFormFieldByQueryState(
      queryState,
      defaultFormValues,
      providerCombo,
      mdCombo,
      brandCombo,
    ),
  });
  const { reset, handleSubmit, clearErrors, setError, setValue, watch } = formMethod;

  useEffect(() => {
    if (isManager && !(providerCombo && mdCombo && brandCombo)) {
      return;
    }

    const formField = toOrderSearchFormFieldByQueryState(
      queryState,
      defaultFormValues,
      providerCombo,
      mdCombo,
      brandCombo,
    );
    reset(formField);
    setOrderActionTypes(getActionTypes(formField.orderStepList));

    if (selectedRowKeys.length > 0) {
      setSelectedRowKeys([]);
    }

    return () => {
      const formField = toOrderSearchFormFieldByQueryState(
        {} as OrderListQueryState,
        defaultFormValues,
        providerCombo,
        mdCombo,
        brandCombo,
      );
      reset(formField);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState, providerCombo, mdCombo, brandCombo]);

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      // 주문상태 변경시 error clear
      if (name && name.match(/^orderStepList/)) {
        clearErrors('orderStepList');
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const { data: orderListResponse, isLoading: isOrderListLoading } = useOrderListQuery(
    toOrderSearchParamsByQueryState(queryState, defaultFormValues, providerCombo, mdCombo, brandCombo),
    isManager,
    {
      onError: onError('주문 리스트 조회중'),
    },
  );

  const { mutateAsync: requestOrderPaid } = useMutation((orderId: string) => putOrderPaid(orderId));
  const { mutateAsync: requestOrderPaidByPartner } = useMutation((params: OrderParams) =>
    putOrderPaidByPartner(params),
  );

  const { mutateAsync: requestOrderPreparingGoods } = useMutation((orderId: string) => putOrderPreparingGoods(orderId));
  const { mutateAsync: requestOrderPreparingGoodsByPartner } = useMutation((params: OrderParams) =>
    putOrderPreparingGoodsByPartner(params),
  );

  useEffect(() => {
    if (isLoadingProviderCombo || isOrderListLoading || isLoadingMDCombo || isLoadingBrandCombo) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrderListLoading, isLoadingProviderCombo, isLoadingMDCombo, isLoadingBrandCombo]);

  /**
   * 검색 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    if (values.orderStepList.filter((item) => !!item).length === 0) {
      setError('orderStepList', { type: 'manual', message: '주문상태는 최소 한개이상 선택해주세요.' });
      return;
    }

    const syncQueryState = toOrderQueryStateBySearchFormField(values, queryState);
    updateQueryState({
      ...syncQueryState,
      page: OrderDefaultSearchPage,
      time: new Date().getTime().toString(),
    });
  });

  /**
   * 검색 필터 초기화
   */
  const handleReset = () => {
    const resetFormValues = {
      ...defaultFormValues,
      fromDate: toDateFormat(addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7).getTime()),
      toDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`).getTime()),
    };
    reset(resetFormValues);
    updateQueryState({
      ...toOrderQueryStateBySearchFormField(resetFormValues, queryState),
      page: OrderDefaultSearchPage,
      time: new Date().getTime().toString(),
    });
  };

  /**
   * 페이지 번호 및 페이지수 변경시
   */
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: limit.toString(),
    });
  };

  /**
   * table row selection event
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**
   * 주문상태 update
   */
  const handleUpdateOrderStepList = (selectedOption: Array<boolean>) => {
    setValue('orderStepList', selectedOption);
  };

  /**
   * 주문일 날짜 범위 변경
   */
  const handleChangeDateRange = (range: number) => {
    if (range === -1) {
      setValue('fromDate', null);
      setValue('toDate', null);
      return;
    }
    const fromDate = Number.isInteger(range)
      ? addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -range)
      : null;
    const toDate = Number.isInteger(range) ? new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`) : null;

    setValue('fromDate', toDateFormat(fromDate, 'yyyy/MM/dd HH:mm:ss'));
    setValue('toDate', toDateFormat(toDate, 'yyyy/MM/dd HH:mm:ss'));
  };

  /**
   * 결제완료 click event
   */
  const handleClickOrderPaid = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `선택한 ${selectedRowKeys.length}개 주문의 상태를 '결제완료'로 변경하시겠습니까?`,
      onConfirm: executeClickOrderPaid,
    });
  };

  /**
   * 상품준비 click event
   */
  const handleClickOrderPreparingGoods = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `선택한 ${selectedRowKeys.length}개 주문의 상태를 '상품준비'로 변경하시겠습니까?`,
      onConfirm: executeClickOrderPreparingGoods,
    });
  };

  /**
   * 주문리스트 reload
   */
  const reloadOrderList = () => {
    setSelectedRowKeys([]);
    queryClient.invalidateQueries(OrderQueryKeys.lists());
  };

  /**
   * api 병렬 호출
   */
  const callParallelApi = (actionFuncArray: Array<() => Promise<ParallelResponse>>) => {
    return actionFuncArray.reduce(
      async (promise: Promise<Array<ParallelResponse>>, apiCallable: () => Promise<ParallelResponse>) => {
        const previousResult = await promise.then();

        const results = await apiCallable();

        return [...previousResult, ...[results]];
      },
      Promise.resolve([] as Array<ParallelResponse>),
    );
  };

  /**
   * 결제완료 상태 변경처리
   */
  const executeClickOrderPaid = async () => {
    const actionFuncArray = selectedRowKeys.map((rowKey): (() => Promise<ParallelResponse>) => {
      return async () => {
        try {
          if (isManager) {
            await requestOrderPaid(rowKey);
          } else {
            const [orderId, itemId] = rowKey.split('_');
            await requestOrderPaidByPartner({ orderId, itemId });
          }
          return { success: true };
        } catch (error) {
          return { success: false, message: (error as ErrorModel<ErrorDataModel>).data.message };
        }
      };
    });

    dialog.close();
    showLoading();

    const responses = await callParallelApi(actionFuncArray);
    hideLoading();

    const successCount = responses.filter((response) => response.success).length;
    const completeMessage =
      successCount > 0
        ? `처리가 완료되었습니다. (성공: ${successCount} / 전체 ${selectedRowKeys.length})`
        : `처리가 실패하였습니다.`;

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: completeMessage,
      onClose: () => {
        reloadOrderList();
        dialog.close();
      },
    });
  };

  /**
   * 상품준비 상태 변경처리
   */
  const executeClickOrderPreparingGoods = async () => {
    const actionFuncArray = selectedRowKeys.map((rowKey): (() => Promise<ParallelResponse>) => {
      return async () => {
        try {
          if (isManager) {
            await requestOrderPreparingGoods(rowKey);
          } else {
            const [orderId, itemId] = rowKey.split('_');
            await requestOrderPreparingGoodsByPartner({ orderId, itemId });
          }
          return { success: true };
        } catch (error) {
          return { success: false, message: (error as ErrorModel<ErrorDataModel>).data.message };
        }
      };
    });

    dialog.close();
    showLoading();

    const responses = await callParallelApi(actionFuncArray);
    hideLoading();

    const successCount = responses.filter((response) => response.success).length;
    const completeMessage =
      successCount > 0
        ? `처리가 완료되었습니다. (성공: ${successCount} / 전체 ${selectedRowKeys.length})`
        : `처리가 실패하였습니다.`;

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: completeMessage,
      onClose: () => {
        reloadOrderList();
        dialog.close();
      },
    });
  };

  /**
   * 주문 action에 사용될 action type 리턴
   */
  const getActionTypes = (selectedOptions: Array<boolean>): Array<OrderActionType> => {
    const status = toOrderStepStatus(selectedOptions);

    if (isManager) {
      switch (status) {
        case 'ALL':
        case 'IGNORE':
          return [];

        case OrderStatus.PAID:
          return [OrderActionType.PREPARING_GOODS];
        case OrderStatus.PREPARING_GOODS:
          return [OrderActionType.PAID];

        default:
          return [];
      }
    }

    switch (status) {
      case 'ALL':
      case 'IGNORE':
        return [];

      case OrderStatus.PAID:
        return [OrderActionType.PREPARING_GOODS];
      case OrderStatus.PREPARING_GOODS:
        return [OrderActionType.PAID];
      case OrderStatus.PARTIALLY_READY_FOR_EXPORT:
        return [];

      default:
        return [];
    }
  };

  /**
   * 전체 주문상태 선택
   */
  const handleSelectAllItems = () => {
    const orderExportableOption = concat(OrderStatusBeforeExportOptions, OrderStatusAfterExportOptions).map(() => true);
    handleUpdateOrderStepList(orderExportableOption);
  };

  /**
   * 전체 주문상태 선택해제
   */
  const handleUnselectAllItems = () => {
    const orderExportableOption = concat(OrderStatusBeforeExportOptions, OrderStatusAfterExportOptions).map(
      () => false,
    );
    handleUpdateOrderStepList(orderExportableOption);
  };

  /**
   * 주문 excel download
   */
  const handleExcelDownload = async (type: ExcelDownloadType = ExcelDownloadType.ALL) => {
    showLoading();

    const queryStateByExcel: OrderListQueryState = await new Promise<OrderListQueryState>(async (resolve) => {
      if (type === ExcelDownloadType.ALL) {
        await queryClient.invalidateQueries(OrderQueryKeys.lists());

        resolve({
          ...queryState,
          page: OrderDefaultSearchPage,
          size: orderListResponse.totalElements.toString(),
        });
      }

      resolve(queryState);
    });

    const exportableItems = await requestOrderExcelItems(
      toOrderSearchParamsByQueryState(queryStateByExcel, defaultFormValues, providerCombo, mdCombo, brandCombo),
    );

    const excelKeys = Object.keys(OrderExcelCode);

    const headers = excelKeys.map((key) => {
      return OrderExcelCode[key] as string;
    });

    const targetItems =
      type === ExcelDownloadType.ALL
        ? exportableItems.content
        : exportableItems.content.filter((item) => {
            const itemRowKey = isManager
              ? item.orderId.toString()
              : `${item.orderId.toString()}_${item.itemId}_${item.orderStatus.step}`;
            return selectedRowKeys.map((rowKey) => String(rowKey)).includes(itemRowKey);
          });

    const sheetData = toOrderExcelItems(targetItems, isManager);

    hideLoading();

    excelExport({
      headers: [headers],
      sheetData,
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: `주문목록_${toDateFormat(new Date(), 'yyyyMMddHHmm')}.xlsx`,
    });
  };

  /**
   * 주문 선택항목 엑셀 다운로드
   */
  const handleDownloadSelectedItems = () => {
    handleExcelDownload(ExcelDownloadType.SELECTION);
  };

  /**
   * 주문 검색결과 엑셀 다운로드
   */
  const handleDownloadAllItems = () => {
    handleExcelDownload(ExcelDownloadType.ALL);
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
      handleReset,
      handleUpdateOrderStepList,
      handleChangeDateRange,
      handleSelectAllItems,
      handleUnselectAllItems,
    },
    orderList: orderListResponse?.content ?? [],
    providerCombo,
    mdCombo,
    brandCombo,
    isLoading: isOrderListLoading || isLoadingProviderCombo,
    pagination: {
      limit: Number(queryState.size || OrderDefaultSearchSize),
      page: Number(queryState.page || OrderDefaultSearchPage),
      total: orderListResponse?.totalElements || 0,
      onChange: handleChangePagination,
    },
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
    },
    action: {
      orderActionTypes,
      disabledAllItemsExcelDownload: (orderListResponse?.content ?? []).length <= 0,
      handleClickOrderPaid,
      handleClickOrderPreparingGoods,
      handleReloadOrderList: reloadOrderList,
      handleDownloadSelectedItems,
      handleDownloadAllItems,
    },
  };
};
