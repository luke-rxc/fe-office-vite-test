import { SiteType } from '@constants/site';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useQueryState } from '@hooks/useQueryState';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { toDateFormat } from '@utils/date';
import { excelExport } from '@utils/excel';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { getOrderRefundItems } from '../apis';
import {
  OrderSearchFieldType,
  RefundStatusOptions,
  OrderDefaultSearchPage,
  OrderRefundExcelCode,
  ExcelDownloadType,
  OrderRefundQueryKeys,
  OrderDefaultSearchSize,
} from '../constants';
import { useOrderRefundListQuery, useProviderComboQuery } from '../hooks';
import {
  toOrderRefundExcelItems,
  toOrderRefundQueryStateBySearchFormField,
  toOrderRefundSearchFormFieldByQueryState,
  toOrderRefundSearchParamsByQueryState,
} from '../models';
import { OrderRefundListQueryState, OrderRefundListSearchParams, OrderRefundSearchFormField } from '../types';

export type ReturnTypeUseOrderRefundListService = ReturnType<typeof useOrderRefundListService>;

/**
 * 주문 환불리스트 service
 */
export const useOrderRefundListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const currentSiteType = useSiteType();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const { queryState, updateQueryState } = useQueryState<OrderRefundListQueryState>();
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const isManager = currentSiteType === SiteType.MANAGER;

  const defaultFormValues: OrderRefundSearchFormField = {
    keyword: '',
    fromDate: toDateFormat(addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7)),
    toDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`)),
    searchType: OrderSearchFieldType.ORDER,
    refundType: '',
    refundStatusList: RefundStatusOptions.map((_, index) => index === 0),
    provider: null,
  };

  const { data: providerCombo, isLoading: isLoadingProviderCombo } = useProviderComboQuery({
    enabled: isManager,
  });

  // 환불 엑셀 data 조회
  const { mutateAsync: getExportableItems } = useMutation((params: OrderRefundListSearchParams) =>
    getOrderRefundItems(params),
  );

  const formMethod = useForm<OrderRefundSearchFormField>({
    defaultValues: toOrderRefundSearchFormFieldByQueryState(queryState, defaultFormValues, providerCombo),
  });
  const { clearErrors, reset, handleSubmit, setError, setValue, watch } = formMethod;

  const onError = (error: ErrorModel, targetName: string) => {
    dialog.open({
      content: `${targetName} 문제가 발생하였습니다\r\n(${error.data.message})`,
      type: DialogType.ALERT,
    });
  };

  useEffect(() => {
    if (!providerCombo) {
      return;
    }

    const formField = toOrderRefundSearchFormFieldByQueryState(queryState, defaultFormValues, providerCombo);
    reset(formField);

    if (selectedRowKeys.length > 0) {
      setSelectedRowKeys([]);
    }

    return () => {
      const formField = toOrderRefundSearchFormFieldByQueryState(
        {} as OrderRefundListQueryState,
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
      if (name && name.match(/^refundStatusList/)) {
        clearErrors('refundStatusList');
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  // 환불리스트
  const { data: refundListResponse, isLoading: isLoadingRefundList } = useOrderRefundListQuery(
    toOrderRefundSearchParamsByQueryState(queryState, defaultFormValues, providerCombo),
    {
      onError: (error) => onError(error, '환불 리스트 조회중'),
    },
  );

  useEffect(() => {
    if (isLoadingProviderCombo || isLoadingRefundList) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [hideLoading, isLoadingRefundList, isLoadingProviderCombo, showLoading]);

  /**
   * 검색 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    if (values.refundStatusList.filter((item) => !!item).length === 0) {
      setError('refundStatusList', { type: 'manual', message: '환불상태는 최소 한개이상 선택해주세요.' });
      return;
    }

    const syncQueryState = toOrderRefundQueryStateBySearchFormField(values, queryState);
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
      fromDate: toDateFormat(addDays(new Date(), -7).getTime()),
      toDate: toDateFormat(new Date().getTime()),
    };
    reset(resetFormValues);
    updateQueryState({
      ...toOrderRefundQueryStateBySearchFormField(resetFormValues, queryState),
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
   * 주문 환불상태 update
   */
  const handleUpdateStatusList = (selectedOption: Array<boolean>) => {
    setValue('refundStatusList', selectedOption);
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
   * 환불 excel download
   *
   * @param type 전체, 선택항목
   */
  const handleDownloadRefundItems = async (type: ExcelDownloadType = ExcelDownloadType.ALL) => {
    showLoading();

    const queryStateByExcel: OrderRefundListQueryState = await new Promise<OrderRefundListQueryState>(
      async (resolve) => {
        if (type === ExcelDownloadType.ALL) {
          await queryClient.invalidateQueries(
            OrderRefundQueryKeys.list(
              toOrderRefundSearchParamsByQueryState(queryState, defaultFormValues, providerCombo),
            ),
          );

          resolve({
            ...queryState,
            page: OrderDefaultSearchPage,
            size: refundListResponse.totalElements.toString(),
          });
        }

        resolve(queryState);
      },
    );

    const exportableItems = await getExportableItems(
      toOrderRefundSearchParamsByQueryState(queryStateByExcel, defaultFormValues, providerCombo),
    );

    const excelKeys = Object.keys(OrderRefundExcelCode);

    const headers = excelKeys.map((key) => {
      return OrderRefundExcelCode[key] as string;
    });

    const targetItems =
      type === ExcelDownloadType.ALL
        ? exportableItems.content
        : exportableItems.content.filter((item) =>
            selectedRowKeys.map((rowKey) => String(rowKey)).includes(item.id.toString()),
          );

    const sheetData = toOrderRefundExcelItems(targetItems);

    hideLoading();

    excelExport({
      headers: [headers],
      sheetData,
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: `환불목록_${toDateFormat(new Date(), 'yyyyMMddHHmm')}.xlsx`,
    });
  };

  /**
   * 환불 선택항목 엑셀 다운로드
   */
  const handleDownloadRefundSelectedItems = () => {
    handleDownloadRefundItems(ExcelDownloadType.SELECTION);
  };

  /**
   * 환불 검색결과 엑셀 다운로드
   */
  const handleDownloadRefundAllItems = () => {
    handleDownloadRefundItems(ExcelDownloadType.ALL);
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
      handleReset,
      handleChangeDateRange,
      handleUpdateStatusList,
    },
    refundList: refundListResponse?.content ?? [],
    providerCombo,
    isLoading: isLoadingRefundList || isLoadingProviderCombo,
    pagination: {
      limit: Number(queryState.size || OrderDefaultSearchSize),
      page: Number(queryState.page || OrderDefaultSearchPage),
      total: refundListResponse?.totalElements || 0,
      onChange: handleChangePagination,
    },
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
    },
    action: {
      isExistSelection: selectedRowKeys.length > 0,
      disabledAllItemsExcelDownload: (refundListResponse?.content ?? []).length <= 0,
      handleDownloadRefundSelectedItems,
      handleDownloadRefundAllItems,
    },
  };
};
