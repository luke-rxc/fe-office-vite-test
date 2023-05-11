import { SiteType } from '@constants/site';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useQueryState } from '@hooks/useQueryState';
import { useSiteType } from '@hooks/useSiteType';
import { toDateFormat } from '@utils/date';
import { excelExport } from '@utils/excel';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { getOrderReturnExcel } from '../apis';
import {
  OrderSearchFieldType,
  ReturnStatusOptions,
  OrderReturnExcelCode,
  OrderReturnQueryKeys,
  OrderDefaultSearchPage,
  OrderDefaultSearchSize,
} from '../constants';
import { useOrderReturnListQuery, useProviderComboQuery } from '../hooks';
import {
  toOrderReturnExcelItems,
  toOrderReturnQueryStateBySearchFormField,
  toOrderReturnSearchFormFieldByQueryState,
  toOrderReturnSearchParamsByQueryState,
} from '../models';
import { OrderReturnListQueryState, OrderReturnListSearchParams, OrderReturnSearchFormField } from '../types';

export type ReturnTypeUseOrderReturnListService = ReturnType<typeof useOrderReturnListService>;

/**
 * 주문 반품리스트 service
 */
export const useOrderReturnListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const currentSiteType = useSiteType();
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const { queryState, updateQueryState } = useQueryState<OrderReturnListQueryState>();
  const isManager = currentSiteType === SiteType.MANAGER;

  const defaultFormValues: OrderReturnSearchFormField = {
    keyword: '',
    fromDate: toDateFormat(addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7)),
    toDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`)),
    searchType: OrderSearchFieldType.ORDER,
    returnType: '',
    returnStatusList: ReturnStatusOptions.map((_, index) => index === 0),
    provider: null,
  };

  const { data: providerCombo, isLoading: isLoadingProviderCombo } = useProviderComboQuery({
    enabled: isManager,
  });

  // 반품 리스트
  const { data: returnListResponse, isLoading: isLoadingReturnList } = useOrderReturnListQuery(
    toOrderReturnSearchParamsByQueryState(queryState, defaultFormValues, providerCombo),
  );

  // 출고(티켓) 엑셀 data 조회
  const { mutateAsync: getExportableItems } = useMutation((params: OrderReturnListSearchParams) =>
    getOrderReturnExcel(params),
  );

  const formMethod = useForm<OrderReturnSearchFormField>({
    defaultValues: toOrderReturnSearchFormFieldByQueryState(queryState, defaultFormValues, providerCombo),
  });
  const { clearErrors, reset, handleSubmit, setError, setValue, watch } = formMethod;

  useEffect(() => {
    if (!providerCombo) {
      return;
    }

    const formField = toOrderReturnSearchFormFieldByQueryState(queryState, defaultFormValues, providerCombo);
    reset(formField);

    if (selectedRowKeys.length > 0) {
      setSelectedRowKeys([]);
    }

    return () => {
      const formField = toOrderReturnSearchFormFieldByQueryState(
        {} as OrderReturnListQueryState,
        defaultFormValues,
        providerCombo,
      );
      reset(formField);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerCombo, queryState]);

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      // 주문상태 변경시 error clear
      if (name && name.match(/^returnStatusList/)) {
        clearErrors('returnStatusList');
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  useEffect(() => {
    if (isLoadingProviderCombo || isLoadingReturnList) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [hideLoading, isLoadingReturnList, isLoadingProviderCombo, showLoading]);

  /**
   * 검색 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    if (values.returnStatusList.filter((item) => !!item).length === 0) {
      setError('returnStatusList', { type: 'manual', message: '반품/교환 상태는 최소 한개이상 선택해주세요.' });
      return;
    }

    const syncQueryState = toOrderReturnQueryStateBySearchFormField(values, queryState);
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
      ...toOrderReturnQueryStateBySearchFormField(resetFormValues, queryState),
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
   * 주문 환불상태 update
   */
  const handleUpdateStatusList = (selectedOption: Array<boolean>) => {
    setValue('returnStatusList', selectedOption);
  };

  const handleDownloadExcel = async () => {
    showLoading();

    await queryClient.invalidateQueries(
      OrderReturnQueryKeys.list(toOrderReturnSearchParamsByQueryState(queryState, defaultFormValues, providerCombo)),
    );

    const manualQueryState = {
      ...queryState,
      page: OrderDefaultSearchPage,
      size: returnListResponse.totalElements.toString(),
    };

    const exportableItems = await getExportableItems(
      toOrderReturnSearchParamsByQueryState(manualQueryState, defaultFormValues, providerCombo),
    );

    const excelKeys = Object.keys(OrderReturnExcelCode);

    const headers = excelKeys.map((key) => {
      return OrderReturnExcelCode[key] as string;
    });

    const sheetData = toOrderReturnExcelItems(exportableItems.content);

    hideLoading();

    excelExport({
      headers: [headers],
      sheetData,
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: `반품목록_${toDateFormat(new Date(), 'yyyyMMddHHmm')}.xlsx`,
    });
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
      handleReset,
      handleChangeDateRange,
      handleUpdateStatusList,
    },
    returnList: returnListResponse?.content ?? [],
    providerCombo,
    isLoading: isLoadingReturnList || isLoadingProviderCombo,
    isManager,
    pagination: {
      limit: Number(queryState.size || OrderDefaultSearchSize),
      page: Number(queryState.page || OrderDefaultSearchPage),
      total: returnListResponse?.totalElements || 0,
      onChange: handleChangePagination,
    },
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
    },
    handleDownloadExcel,
  };
};
