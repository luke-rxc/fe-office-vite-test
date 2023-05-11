import { SiteType } from '@constants/site';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useQueryState } from '@hooks/useQueryState';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { toDateFormat } from '@utils/date';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { getOrderExportItems, putOrderExportOrderComplete, putOrderExportShippingComplete } from '../apis';
import {
  OrderDefaultSearchPage,
  ExcelDownloadType,
  OrderExportExcelCode,
  OrderExportQueryKeys,
  OrderSearchFieldType,
  OrderStatus,
  OrderStatusExportOptions,
  OrderDefaultSearchSize,
} from '../constants';
import {
  toOrderExportExcelItems,
  toOrderExportQueryStateBySearchFormField,
  toOrderExportSearchFormFieldByQueryState,
  toOrderExportSearchParamsByQueryState,
} from '../models';
import {
  OrderExportListQueryState,
  OrderExportListSearchParams,
  OrderExportSearchFormField,
  ParallelResponse,
} from '../types';
import { excelExport } from '@utils/excel';
import { useOrderCommonMDComboQuery, useOrderExportListQuery, useProviderComboQuery } from '../hooks';

export type ReturnTypeUseOrderExportListService = ReturnType<typeof useOrderExportListService>;

/**
 * 주문 출고리스트 service
 */
export const useOrderExportListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const currentSiteType = useSiteType();
  const dialog = useDialog();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isManager = currentSiteType === SiteType.MANAGER;

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [enabledActionShippingComplete, setEnabledActionShippingComplete] = useState<boolean>(false);
  const [enabledActionOrderComplete, setEnabledActionOrderComplete] = useState<boolean>(false);
  const { queryState, updateQueryState } = useQueryState<OrderExportListQueryState>();

  const defaultFormValues: OrderExportSearchFormField = {
    keyword: '',
    fromDate: toDateFormat(addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7)),
    toDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`)),
    searchType: OrderSearchFieldType.ORDER,
    exportStatusList: OrderStatusExportOptions.map((_, index) => index === 0),
    provider: null,
    md: null,
    purchaseConfirmYN: false,
  };

  /**
   * 에러 공통 처리
   */
  const onError = (error: ErrorModel, errorMessage: string) => {
    dialog.open({
      content: `${errorMessage} 문제가 발생하였습니다\r\n(${error.data.message})`,
      type: DialogType.ALERT,
      onClose: () => {
        dialog.close();
        navigate('/export/list');
      },
    });
  };

  const { data: providerCombo, isLoading: isLoadingProviderCombo } = useProviderComboQuery({
    enabled: isManager,
    onError: (error) => onError(error, '출고 리스트 조회중'),
  });

  const { data: mdCombo, isLoading: isLoadingMDCombo } = useOrderCommonMDComboQuery({
    enabled: isManager,
    onError: (error) => onError(error, '출고 리스트 조회중'),
  });

  const formMethod = useForm<OrderExportSearchFormField>({
    defaultValues: toOrderExportSearchFormFieldByQueryState(queryState, defaultFormValues, providerCombo, mdCombo),
  });
  const { clearErrors, reset, handleSubmit, setError, setValue, watch } = formMethod;

  useEffect(() => {
    if (currentSiteType === SiteType.MANAGER && !(providerCombo && mdCombo)) {
      return;
    }

    const formField = toOrderExportSearchFormFieldByQueryState(queryState, defaultFormValues, providerCombo, mdCombo);
    reset(formField);
    checkActionShippingComponent(formField.exportStatusList);
    checkActionOrderComponent(formField);

    if (selectedRowKeys.length > 0) {
      setSelectedRowKeys([]);
    }

    return () => {
      const formField = toOrderExportSearchFormFieldByQueryState(
        {} as OrderExportListQueryState,
        defaultFormValues,
        providerCombo,
        mdCombo,
      );
      reset(formField);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState, providerCombo, mdCombo]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      // 주문상태 변경시 error clear
      if (name) {
        if (name.match(/^exportStatusList/)) {
          handleChangeExportStatusList(values);
          clearErrors('exportStatusList');
        } else if (name.match(/^purchaseConfirmYN/)) {
          handleChangePurchaseConfirm(values);
        }
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  // 촐고 리스트
  const { data: exportListResponse, isLoading: isLoadingExportList } = useOrderExportListQuery(
    toOrderExportSearchParamsByQueryState(queryState, defaultFormValues, providerCombo, mdCombo),
    {
      onError: (error) => onError(error, '출고 리스트 조회중'),
    },
  );

  const { mutateAsync: requestOrderExportShippingComplete } = useMutation((exportId: string) =>
    putOrderExportShippingComplete(exportId),
  );

  const { mutateAsync: requestOrderExportOrderComplete } = useMutation((exportId: string) =>
    putOrderExportOrderComplete(exportId),
  );

  // 출고 엑셀 data 조회
  const { mutateAsync: getExportableItems } = useMutation((params: OrderExportListSearchParams) =>
    getOrderExportItems(params),
  );

  useEffect(() => {
    if (isLoadingProviderCombo || isLoadingExportList || isLoadingMDCombo) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [hideLoading, isLoadingExportList, isLoadingProviderCombo, isLoadingMDCombo, showLoading]);

  /**
   * 검색 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    if (values.exportStatusList.filter((item) => !!item).length === 0) {
      setError('exportStatusList', { type: 'manual', message: '출고상태는 최소 한개이상 선택해주세요.' });
      return;
    }

    const syncQueryState = toOrderExportQueryStateBySearchFormField(values, queryState);
    updateQueryState({
      ...syncQueryState,
      page: '1',
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
      ...toOrderExportQueryStateBySearchFormField(resetFormValues, queryState),
      page: '1',
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
    setValue('exportStatusList', selectedOption);
  };

  /**
   * 출고일 날짜 범위 변경
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
   * 배송완료 상태변경 action 처리 가능여부 체크
   */
  const checkActionShippingComponent = (selectedOptions: Array<boolean>): void => {
    const selectedOptionsValueList = selectedOptions
      .map((item, index) => (item ? OrderStatusExportOptions[index] : null))
      .filter((item) => !!item);

    const shippingCompleteCount = selectedOptionsValueList.filter(
      (status) => status === OrderStatus.SHIPPING_COMPLETED,
    ).length;

    setEnabledActionShippingComplete((prev) => {
      if (prev !== (shippingCompleteCount === 0)) {
        return !prev;
      }

      return prev;
    });
  };

  /**
   * 구매확정 상태변경 action 처리 가능여부 체크
   */
  const checkActionOrderComponent = ({ exportStatusList, purchaseConfirmYN }: OrderExportSearchFormField): void => {
    const selectedOptionsValueList = exportStatusList
      .map((item, index) => (item ? OrderStatusExportOptions[index] : null))
      .filter((item) => !!item);

    const shippingNonCompleteCount = selectedOptionsValueList.filter(
      (status) => status !== OrderStatus.SHIPPING_COMPLETED,
    ).length;

    setEnabledActionOrderComplete((prev) => {
      if (prev !== (shippingNonCompleteCount === 0) && !purchaseConfirmYN) {
        return !prev;
      }

      if (purchaseConfirmYN && prev) {
        return false;
      }

      return prev;
    });
  };

  /**
   * 주문리스트 reload
   */
  const reloadOrderList = () => {
    setSelectedRowKeys([]);
    queryClient.invalidateQueries(
      OrderExportQueryKeys.list(
        toOrderExportSearchParamsByQueryState(queryState, defaultFormValues, providerCombo, mdCombo),
      ),
    );
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
   * 배송완료 상태 변경처리
   */
  const executeShippingComplete = async () => {
    const actionFuncArray = selectedRowKeys.map((rowKey): (() => Promise<ParallelResponse>) => {
      return async () => {
        try {
          await requestOrderExportShippingComplete(rowKey);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: `[출고ID:${rowKey}] - ${(error as ErrorModel<ErrorDataModel>).data.message}`,
          };
        }
      };
    });

    showLoading();

    const responses = await callParallelApi(actionFuncArray);

    const successCount = responses.filter((response) => response.success).length;
    const completeMessage =
      successCount > 0
        ? `'배송완료' 상태변경 처리가 완료되었습니다. (성공: ${successCount} / 전체 ${selectedRowKeys.length})`
        : `'배송완료' 상태변경 처리가 실패하였습니다. \r\n${responses.map((item) => {
            return `\r\n${item.message}`;
          })}`;

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: completeMessage,
      onClose: () => {
        hideLoading();
        reloadOrderList();
        dialog.close();
      },
    });
  };

  /**
   * 구매확정 상태 변경처리
   */
  const executeOrderComplete = async () => {
    const actionFuncArray = selectedRowKeys.map((rowKey): (() => Promise<ParallelResponse>) => {
      return async () => {
        try {
          await requestOrderExportOrderComplete(rowKey);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: `[출고ID:${rowKey}] - ${(error as ErrorModel<ErrorDataModel>).data.message}`,
          };
        }
      };
    });

    showLoading();

    const responses = await callParallelApi(actionFuncArray);

    const successCount = responses.filter((response) => response.success).length;
    const completeMessage =
      successCount > 0
        ? `'구매확정' 상태변경 처리가 완료되었습니다. (성공: ${successCount} / 전체 ${selectedRowKeys.length})`
        : `'구매확정' 상태변경 처리가 실패하였습니다. \r\n${responses.map((item) => {
            return `\r\n${item.message}`;
          })}`;

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: completeMessage,
      onClose: () => {
        hideLoading();
        reloadOrderList();
        dialog.close();
      },
    });
  };

  /**
   * 결제완료 click event
   */
  const handleClickShippingComplete = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `선택한 ${selectedRowKeys.length}개 주문의 상태를 '배송완료'로 변경하시겠습니까?`,
      onConfirm: executeShippingComplete,
    });
  };

  /**
   * 구매확정 click event
   */
  const handleClickOrderComplete = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `선택한 ${selectedRowKeys.length}개 주문의 상태를 '구매확정'으로 변경하시겠습니까?`,
      onConfirm: executeOrderComplete,
    });
  };

  /**
   * 구매확정 필터 변경시 처리
   */
  const handleChangePurchaseConfirm = ({ exportStatusList, purchaseConfirmYN }: OrderExportSearchFormField) => {
    // 구매확정 필터 선택된 경우 출고상태 필터의 배송완료 체크 설정
    if (purchaseConfirmYN) {
      const updateExportStatusList = exportStatusList.map((selected, index) => {
        if (OrderStatusExportOptions[index] === OrderStatus.SHIPPING_COMPLETED) {
          return true;
        }
        return selected;
      });
      if (!Object.is(JSON.stringify(updateExportStatusList), JSON.stringify(exportStatusList))) {
        setValue('exportStatusList', updateExportStatusList);
      }
    }
  };

  /**
   * 출고상태 필터 변경시 처리
   */
  const handleChangeExportStatusList = ({ exportStatusList, purchaseConfirmYN }: OrderExportSearchFormField) => {
    const completeIndex = OrderStatusExportOptions.findIndex((option) => option === OrderStatus.SHIPPING_COMPLETED);

    // 출고상태 필터중 배송완료 체크해제이면서 구매확정 필터 선택된 경우 구매확정 필터 선택해제
    if (!exportStatusList[completeIndex] && purchaseConfirmYN) {
      setValue('purchaseConfirmYN', false);
    }
  };

  /**
   * 출고(티켓) excel 전체 download
   */
  const handleDownloadExportItems = async (type: ExcelDownloadType = ExcelDownloadType.ALL) => {
    showLoading();

    const queryStateByExcel: OrderExportListQueryState = await new Promise<OrderExportListQueryState>(
      async (resolve) => {
        if (type === ExcelDownloadType.ALL) {
          await queryClient.invalidateQueries(
            OrderExportQueryKeys.list(
              toOrderExportSearchParamsByQueryState(queryState, defaultFormValues, providerCombo, mdCombo),
            ),
          );

          resolve({
            ...queryState,
            page: OrderDefaultSearchPage,
            size: exportListResponse.totalElements.toString(),
          });
        }

        resolve(queryState);
      },
    );

    const exportableItems = await getExportableItems(
      toOrderExportSearchParamsByQueryState(queryStateByExcel, defaultFormValues, providerCombo, mdCombo),
    );

    const excelKeys = Object.keys(OrderExportExcelCode);

    const headers = excelKeys.map((key) => {
      return OrderExportExcelCode[key] as string;
    });

    const targetItems =
      type === ExcelDownloadType.ALL
        ? exportableItems.content
        : exportableItems.content.filter((item) =>
            selectedRowKeys.map((rowKey) => String(rowKey)).includes(item.id.toString()),
          );

    const sheetData = toOrderExportExcelItems(targetItems);

    hideLoading();

    excelExport({
      headers: [headers],
      sheetData,
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: `출고/배송목록_${toDateFormat(new Date(), 'yyyyMMddHHmm')}.xlsx`,
    });
  };

  /**
   * 출고 선택항목 엑셀 다운로드
   */
  const handleDownloadExportSelectedItems = () => {
    handleDownloadExportItems(ExcelDownloadType.SELECTION);
  };

  /**
   * 출고 검색결과 엑셀 다운로드
   */
  const handleDownloadExportAllItems = () => {
    handleDownloadExportItems(ExcelDownloadType.ALL);
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
      handleReset,
      handleUpdateOrderStepList,
      handleChangeDateRange,
    },
    exportList: exportListResponse?.content ?? [],
    providerCombo,
    mdCombo,
    actions: {
      isExistSelection: selectedRowKeys.length > 0,
      isManager,
      disabledAllItemsExcelDownload: (exportListResponse?.content ?? []).length <= 0,
      enabledActionShippingComplete,
      enabledActionOrderComplete,
      handleClickShippingComplete,
      handleClickOrderComplete,
      handleDownloadExportSelectedItems,
      handleDownloadExportAllItems,
    },
    isLoading: isLoadingExportList || isLoadingProviderCombo,
    pagination: {
      limit: Number(queryState.size || OrderDefaultSearchSize),
      page: Number(queryState.page || OrderDefaultSearchPage),
      total: exportListResponse?.totalElements || 0,
      onChange: handleChangePagination,
    },
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
    },
  };
};
