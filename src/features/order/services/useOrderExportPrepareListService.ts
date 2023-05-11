import { SiteType } from '@constants/site';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { toDateFormat } from '@utils/date';
import { addDays } from 'date-fns';
import concat from 'lodash/concat';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import {
  OrderActionType,
  OrderDefaultSearchPage,
  OrderDefaultSearchSize,
  OrderQueryKeys,
  OrderSearchFieldType,
  OrderStatusExportableOptions,
} from '../constants';
import { useBrandComboQuery, useOrderCommonMDComboQuery, useOrderListQuery, useProviderComboQuery } from '../hooks';
import {
  toOrderQueryStateBySearchFormField,
  toOrderSearchFormFieldByQueryState,
  toOrderSearchParamsByQueryState,
} from '../models';
import { OrderListQueryState, OrderSearchFormField } from '../types';

export type ReturnTypeUseOrderExportPrepareListService = ReturnType<typeof useOrderExportPrepareListService>;

/**
 * 송장 등록 대기 service
 */
export const useOrderExportPrepareListService = () => {
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const currentSiteType = useSiteType();
  const { showLoading, hideLoading } = useLoading();
  const isManager = currentSiteType === SiteType.MANAGER;

  const [openExportModal, setOpenExportModal] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [orderActionTypes, setOrderActionTypes] = useState<Array<OrderActionType>>([]);
  const { queryState, updateQueryState } = useQueryState<OrderListQueryState>();

  const defaultFormValues: OrderSearchFormField = {
    keyword: '',
    fromDate: toDateFormat(addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7)),
    toDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`)),
    searchType: OrderSearchFieldType.ORDER,
    orderStepList: OrderStatusExportableOptions.map(() => true),
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
    onError: onError('송장 등록 대기 조회중'),
  });

  const { data: mdCombo, isLoading: isLoadingMDCombo } = useOrderCommonMDComboQuery({
    enabled: isManager,
    onError: onError('송장 등록 대기 조회중'),
  });

  const { data: brandCombo, isLoading: isLoadingBrandCombo } = useBrandComboQuery({
    enabled: isManager,
    onError: onError('송장 등록 대기 조회중'),
  });

  const formMethod = useForm<OrderSearchFormField>({
    defaultValues: toOrderSearchFormFieldByQueryState(
      queryState,
      defaultFormValues,
      providerCombo,
      mdCombo,
      brandCombo,
      true,
    ),
  });
  const { reset, handleSubmit, clearErrors, setError, setValue, watch } = formMethod;

  useEffect(() => {
    return () => {
      setOpenExportModal(false);
    };
  }, []);

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
      true,
    );
    reset(formField);
    setOrderActionTypes(getActionTypes());

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
        true,
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
    toOrderSearchParamsByQueryState(queryState, defaultFormValues, providerCombo, mdCombo, brandCombo, true),
    isManager,
    {
      onError: onError('송장 등록 대기 조회중'),
    },
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

    const syncQueryState = toOrderQueryStateBySearchFormField(values, queryState, true);
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
      ...toOrderQueryStateBySearchFormField(resetFormValues, queryState, true),
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
   * 주문 출고 modal open
   */
  const handleOpenOrderExportModel = () => {
    setOpenExportModal(true);
  };

  /**
   * 주문 출고 modal close
   */
  const handleCloseOrderExportModel = () => {
    setOpenExportModal(false);
  };

  /**
   * 주문리스트 reload
   */
  const reloadOrderList = () => {
    setSelectedRowKeys([]);
    queryClient.invalidateQueries(OrderQueryKeys.lists());
  };

  /**
   * 주문 action에 사용될 action type 리턴
   */
  const getActionTypes = (): Array<OrderActionType> => {
    if (isManager) {
      return [];
    }

    return [OrderActionType.DOWNLOAD, OrderActionType.UPLOAD];
  };

  /**
   * 전체 주문상태 선택
   */
  const handleSelectAllItems = () => {
    const orderExportableOption = concat(OrderStatusExportableOptions).map(() => true);
    handleUpdateOrderStepList(orderExportableOption);
  };

  /**
   * 전체 주문상태 선택해제
   */
  const handleUnselectAllItems = () => {
    const orderExportableOption = concat(OrderStatusExportableOptions).map(() => false);
    handleUpdateOrderStepList(orderExportableOption);
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
    openExportModal,
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
      handleOpenOrderExportModel,
      handleCloseOrderExportModel,
      handleReloadOrderList: reloadOrderList,
    },
  };
};
