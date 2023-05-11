import { SiteType } from '@constants/site';
import { useQuery } from '@hooks/useQuery';
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
import {
  getOrderExportTicketItems,
  getTicketCombo,
  putOrderExportTicketAllUsed,
  putOrderExportTicketUnUsed,
  putOrderExportTicketUsed,
} from '../apis';
import {
  OrderDefaultSearchPage,
  ExcelDownloadType,
  ExportTicketActionType,
  ExportTicketGoodsKindOptions,
  ExportTicketStatusOptions,
  OrderExportTicketExcelCode,
  OrderExportTicketGoodsKind,
  OrderExportTicketQueryKeys,
  OrderExportTicketStatus,
  OrderSearchFieldType,
  ticketComboQueryKey,
  OrderDefaultSearchSize,
} from '../constants';
import {
  toExportTicketGoodsKindValueList,
  toExportTicketStatusValueList,
  toOrderExportTicketBulkUsedParamsBySearchFormField,
  toOrderExportTicketExcelItems,
  toOrderExportTicketQueryStateBySearchFormField,
  toOrderExportTicketSearchFormFieldByQueryState,
  toOrderExportTicketSearchParamsByQueryState,
  toTicketComboListModel,
} from '../models';
import {
  OrderExportTicketBulkUsedParams,
  OrderExportTicketListQueryState,
  OrderExportTicketListSearchParams,
  OrderExportTicketSearchFormField,
  ParallelResponse,
} from '../types';
import { excelExport } from '@utils/excel';
import { isNaN } from 'lodash';
import { useOrderCommonMDComboQuery, useOrderExportTicketListQuery, useProviderComboQuery } from '../hooks';

export type ReturnTypeUseOrderExportTicketListService = ReturnType<typeof useOrderExportTicketListService>;

/**
 * 주문 출고(티켓)리스트 service
 */
export const useOrderExportTicketListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const currentSiteType = useSiteType();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const isManager = currentSiteType === SiteType.MANAGER;

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [exportTicketActionTypes, setExportTicketActionTypes] = useState<Array<ExportTicketActionType>>([]);

  const { queryState, updateQueryState } = useQueryState<OrderExportTicketListQueryState>();

  const defaultFormValues: OrderExportTicketSearchFormField = {
    keyword: '',
    fromDate: toDateFormat(
      addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7),
      `yyyy-MM-dd'T'HH:mm`,
    ),
    toDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`), `yyyy-MM-dd'T'HH:mm`),
    searchType: OrderSearchFieldType.ORDER,
    goodsKindList: ExportTicketGoodsKindOptions.map((item) => item === OrderExportTicketGoodsKind.TICKET_NORMAL),
    ticketStatusList: ExportTicketStatusOptions.map((option) => {
      // 티켓상태 기본 설정
      // 매니저일 경우 결제완료, 미사용 체크
      // 파트너일 경우 미사용 체크
      if (isManager) {
        return option === OrderExportTicketStatus.STANDBY || option === OrderExportTicketStatus.ISSUED;
      }

      return option === OrderExportTicketStatus.ISSUED;
    }),
    provider: null,
    md: null,
    ticket: null,
    returnedYN: false,
  };

  const onError = (error: ErrorModel, targetName: string) => {
    dialog.open({
      content: `${targetName} 문제가 발생하였습니다\r\n(${error.data.message})`,
      type: DialogType.ALERT,
    });
  };

  const { data: providerCombo, isLoading: isLoadingProviderCombo } = useProviderComboQuery({
    enabled: isManager,
    onError: (error) => onError(error, '출고(티켓) 리스트 조회중'),
  });

  const { data: mdCombo, isLoading: isLoadingMDCombo } = useOrderCommonMDComboQuery({
    enabled: isManager,
    onError: (error) => onError(error, '출고(티켓) 리스트 조회중'),
  });

  const { data: ticketCombo, isLoading: isLoadingTicketCombo } = useQuery(ticketComboQueryKey, getTicketCombo, {
    select: toTicketComboListModel,
    enabled: isManager,
    onError: (error) => onError(error, '출고(티켓) 리스트 조회중'),
  });

  const formMethod = useForm<OrderExportTicketSearchFormField>({
    defaultValues: defaultFormValues,
  });
  const { clearErrors, reset, handleSubmit, setError, setValue, watch, getValues } = formMethod;

  useEffect(() => {
    if (currentSiteType === SiteType.MANAGER && !(providerCombo && mdCombo && ticketCombo)) {
      return;
    }

    const formField = toOrderExportTicketSearchFormFieldByQueryState(
      queryState,
      defaultFormValues,
      providerCombo,
      mdCombo,
      ticketCombo,
    );
    reset(formField);
    checkActionType(formField);

    if (selectedRowKeys.length > 0) {
      setSelectedRowKeys([]);
    }

    return () => {
      const formField = toOrderExportTicketSearchFormFieldByQueryState(
        {} as OrderExportTicketListQueryState,
        defaultFormValues,
        providerCombo,
        mdCombo,
        ticketCombo,
      );
      reset(formField);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mdCombo, providerCombo, ticketCombo, queryState]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      // 출고(티켓) 타입 변경시 error clear
      if (name && name.match(/^goodsKindList/)) {
        clearErrors('goodsKindList');
      }
      // 출고(티켓) 상태 변경시 error clear
      if (name && name.match(/^ticketStatusList/)) {
        handleChangeTicketStatusList(values);
        clearErrors('ticketStatusList');
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const { data: exportTicketListResponse, isLoading: isLoadingExportTicketList } = useOrderExportTicketListQuery(
    toOrderExportTicketSearchParamsByQueryState(queryState, defaultFormValues, providerCombo, mdCombo, ticketCombo),
    {
      onError: (error) => onError(error, '출고(티켓) 리스트 조회중'),
    },
  );

  const { mutateAsync: requestOrderExportTicketUsed } = useMutation((exportId: string) =>
    putOrderExportTicketUsed(exportId),
  );

  const { mutateAsync: requestOrderExportTicketUnUsed } = useMutation((exportId: string) =>
    putOrderExportTicketUnUsed(exportId),
  );

  const { mutateAsync: requestOrderExportTicketAllUsed } = useMutation(
    (params: OrderExportTicketBulkUsedParams) => putOrderExportTicketAllUsed(params),
    {
      onError: (error) => onError(error, '티켓 일괄사용완료 처리중'),
    },
  );

  // 출고(티켓) 엑셀 data 조회
  const { mutateAsync: getExportableItems } = useMutation((params: OrderExportTicketListSearchParams) =>
    getOrderExportTicketItems(params),
  );

  useEffect(() => {
    if (isLoadingProviderCombo || isLoadingExportTicketList || isLoadingMDCombo || isLoadingTicketCombo) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingExportTicketList, isLoadingProviderCombo, isLoadingMDCombo, isLoadingTicketCombo]);

  /**
   * 검색 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    const isNonSelectStatus = values.ticketStatusList.filter((item) => !!item).length === 0;
    const isNonSelectGoodsKind = values.goodsKindList.filter((item) => !!item).length === 0;
    if (isNonSelectStatus || isNonSelectGoodsKind) {
      if (isNonSelectStatus) {
        setError('ticketStatusList', { type: 'manual', message: '티켓 상태는 최소 한개이상 선택해주세요.' });
      }
      if (isNonSelectGoodsKind) {
        setError('goodsKindList', { type: 'manual', message: '티켓 타입은 최소 한개이상 선택해주세요.' });
      }

      return;
    }

    const syncQueryState = toOrderExportTicketQueryStateBySearchFormField(values, queryState);
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
      fromDate: toDateFormat(
        addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7).getTime(),
        `yyyy-MM-dd'T'HH:mm`,
      ),
      toDate: toDateFormat(
        new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`).getTime(),
        `yyyy-MM-dd'T'HH:mm`,
      ),
    };
    reset(resetFormValues);
    updateQueryState({
      ...toOrderExportTicketQueryStateBySearchFormField(resetFormValues, queryState),
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
   * 출고(티켓) 상태 update
   */
  const handleUpdateExportTicketStatusList = (selectedOption: Array<boolean>) => {
    setValue('ticketStatusList', selectedOption);
  };

  /**
   * 출고(티켓) 타입 update
   */
  const handleUpdateExportTicketGoodsKindList = (selectedOption: Array<boolean>) => {
    setValue('goodsKindList', selectedOption);
  };

  /**
   * 출고일 날짜 범위 변경
   */
  const handleChangeDateRange = (range: number) => {
    if (range === -1) {
      setValue('fromDate', '');
      setValue('toDate', '');
      return;
    }
    const fromDate = Number.isInteger(range)
      ? addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -range)
      : '';
    const toDate = Number.isInteger(range) ? new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`) : '';

    setValue('fromDate', toDateFormat(fromDate, `yyyy-MM-dd'T'HH:mm`));
    setValue('toDate', toDateFormat(toDate, `yyyy-MM-dd'T'HH:mm`));
  };

  /**
   * 출고(티켓) 상태변경 action 처리 가능여부 체크
   */
  const checkActionType = ({
    goodsKindList,
    ticketStatusList,
    ticket,
    fromDate,
    toDate,
    searchType,
    keyword,
  }: OrderExportTicketSearchFormField): void => {
    const selectedGoodsKindOptionsValueList = toExportTicketGoodsKindValueList(goodsKindList);
    const selectedStatusOptionsValueList = toExportTicketStatusValueList(ticketStatusList);

    if (selectedGoodsKindOptionsValueList.length !== 1 || selectedStatusOptionsValueList.length !== 1) {
      exportTicketActionTypes.length > 0 && setExportTicketActionTypes([]);
      return;
    }

    if (selectedGoodsKindOptionsValueList.includes(OrderExportTicketGoodsKind.TICKET_AGENT)) {
      exportTicketActionTypes.length > 0 && setExportTicketActionTypes([]);
      return;
    }

    if (selectedStatusOptionsValueList.includes(OrderExportTicketStatus.ISSUED)) {
      if (
        ticket &&
        fromDate &&
        toDate &&
        (!keyword || (!isNaN(Number(keyword)) && searchType === OrderSearchFieldType.GOODS))
      ) {
        setExportTicketActionTypes([
          ExportTicketActionType.ENABLE_CHANGE_USED,
          ExportTicketActionType.ENABLE_CHANGE_ALL_USED,
        ]);
      } else {
        setExportTicketActionTypes([ExportTicketActionType.ENABLE_CHANGE_USED]);
      }
    } else if (selectedStatusOptionsValueList.includes(OrderExportTicketStatus.USED)) {
      setExportTicketActionTypes([ExportTicketActionType.ENABLE_CHANGE_UNUSED]);
    } else {
      setExportTicketActionTypes([]);
    }
  };

  /**
   * 출고(티켓)리스트 reload
   */
  const reloadExportTicketList = () => {
    setSelectedRowKeys([]);
    queryClient.invalidateQueries(
      OrderExportTicketQueryKeys.list(
        toOrderExportTicketSearchParamsByQueryState(queryState, defaultFormValues, providerCombo, mdCombo, ticketCombo),
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
   * 티켓 사용상태로 변경처리
   */
  const executeUpdateUsed = async () => {
    const actionFuncArray = selectedRowKeys.map((rowKey): (() => Promise<ParallelResponse>) => {
      return async () => {
        try {
          await requestOrderExportTicketUsed(rowKey);
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
        ? `'사용완료' 상태변경 처리가 완료되었습니다. (성공: ${successCount} / 전체 ${selectedRowKeys.length})`
        : `'사용완료' 상태변경 처리가 실패하였습니다. \r\n${responses.map((item) => {
            return `\r\n${item.message}`;
          })}`;

    hideLoading();

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: completeMessage,
      onClose: () => {
        reloadExportTicketList();
        dialog.close();
      },
    });
  };

  /**
   * 티켓 미사용 상태로 변경처리
   */
  const executeUpdateIssued = async () => {
    const actionFuncArray = selectedRowKeys.map((rowKey): (() => Promise<ParallelResponse>) => {
      return async () => {
        try {
          await requestOrderExportTicketUnUsed(rowKey);
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
        ? `'미사용' 상태변경 처리가 완료되었습니다. (성공: ${successCount} / 전체 ${selectedRowKeys.length})`
        : `'미사용' 상태변경 처리가 실패하였습니다. \r\n${responses.map((item) => {
            return `\r\n${item.message}`;
          })}`;

    hideLoading();

    dialog.open({
      type: DialogType.ALERT,
      title: '알림',
      content: completeMessage,
      onClose: () => {
        reloadExportTicketList();
        dialog.close();
      },
    });
  };

  /**
   * 일괄 티켓 사용 상태로 변경처리
   */
  const executeUpdateAllUsed = async () => {
    const formValues = getValues();

    showLoading();

    const params = toOrderExportTicketBulkUsedParamsBySearchFormField(formValues, defaultFormValues);
    try {
      const { resultCount } = await requestOrderExportTicketAllUsed(params);
      hideLoading();

      dialog.open({
        type: DialogType.ALERT,
        title: '알림',
        content: `일괄 사용완료 처리가 완료되었습니다. \r\n(${resultCount.toLocaleString()}개 처리완료)`,
        onClose: () => {
          reloadExportTicketList();
          dialog.close();
        },
      });
    } catch (error) {
      hideLoading();
    }
  };

  /**
   * 사용완료 상태변경 click event
   */
  const handleClickUpdateUsed = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `선택한 ${selectedRowKeys.length}개 티켓의 상태를 '사용완료'로 변경하시겠습니까?`,
      onConfirm: executeUpdateUsed,
    });
  };

  /**
   * 미사용 상태변경 click event
   */
  const handleClickUpdateIssued = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `선택한 ${selectedRowKeys.length}개 주문의 티켓를 '미사용'으로 변경하시겠습니까?`,
      onConfirm: executeUpdateIssued,
    });
  };

  /**
   * 일괄 사용완료 상태변경 click event
   */
  const handleClickUpdateAllUsed = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `검색된 티켓의 상태를 일괄 사용완료 처리하시겠습니까?`,
      onConfirm: executeUpdateAllUsed,
    });
  };

  /**
   * 출고(티켓) excel download
   */
  const handleDownloadExportTicketItems = async (type: ExcelDownloadType = ExcelDownloadType.ALL) => {
    showLoading();

    const queryStateByExcel: OrderExportTicketListQueryState = await new Promise<OrderExportTicketListQueryState>(
      async (resolve) => {
        if (type === ExcelDownloadType.ALL) {
          await queryClient.invalidateQueries(
            OrderExportTicketQueryKeys.list(
              toOrderExportTicketSearchParamsByQueryState(
                queryState,
                defaultFormValues,
                providerCombo,
                mdCombo,
                ticketCombo,
              ),
            ),
          );

          resolve({
            ...queryState,
            page: OrderDefaultSearchPage,
            size: exportTicketListResponse.totalElements.toString(),
          });
        }

        resolve(queryState);
      },
    );

    const exportableItems = await getExportableItems(
      toOrderExportTicketSearchParamsByQueryState(
        queryStateByExcel,
        defaultFormValues,
        providerCombo,
        mdCombo,
        ticketCombo,
      ),
    );

    const excelKeys = Object.keys(OrderExportTicketExcelCode).filter((key) => {
      // 매니저 오피스가 아니고 key가 commissionPrice(임금가) 인 경우 제외
      return !(!isManager && key === 'commissionPrice');
    });

    const headers = excelKeys.map((key) => {
      return OrderExportTicketExcelCode[key] as string;
    });

    const targetItems =
      type === ExcelDownloadType.ALL
        ? exportableItems.content
        : exportableItems.content.filter((item) =>
            selectedRowKeys.map((rowKey) => String(rowKey)).includes(item.id.toString()),
          );

    const sheetData = toOrderExportTicketExcelItems(targetItems);

    hideLoading();

    excelExport({
      headers: [headers],
      sheetData,
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: `출고(티켓)목록_${toDateFormat(new Date(), 'yyyyMMddHHmm')}.xlsx`,
    });
  };

  /**
   * 티켓상태 필터 변경시 처리
   */
  const handleChangeTicketStatusList = ({ ticketStatusList, returnedYN }: OrderExportTicketSearchFormField) => {
    const statusCancelIndex = ExportTicketStatusOptions.findIndex(
      (option) => option === OrderExportTicketStatus.CANCELED,
    );

    // 티켓상태 필터중 취소완료 체크상태이면서 반품요청 포함여부 필터 선택해제된 경우 반품요청 포함여부 필터 선택
    if (ticketStatusList[statusCancelIndex] && !returnedYN) {
      setValue('returnedYN', true);
    }
  };

  /**
   * 출고(티켓) 선택항목 엑셀 다운로드
   */
  const handleDownloadExportTicketSelectedItems = () => {
    handleDownloadExportTicketItems(ExcelDownloadType.SELECTION);
  };

  /**
   * 출고(티켓) 검색결과 엑셀 다운로드
   */
  const handleDownloadExportTicketAllItems = () => {
    handleDownloadExportTicketItems(ExcelDownloadType.ALL);
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
      handleReset,
      handleUpdateExportTicketGoodsKindList,
      handleUpdateExportTicketStatusList,
      handleChangeDateRange,
    },
    exportTicketList: exportTicketListResponse?.content ?? [],
    providerCombo,
    mdCombo,
    ticketCombo,
    actions: {
      isExistSelection: selectedRowKeys.length > 0,
      isManager,
      isExistTicketList: (exportTicketListResponse?.content ?? []).length > 0,
      exportTicketActionTypes,
      handleClickUpdateIssued,
      handleClickUpdateUsed,
      handleClickUpdateAllUsed,
      handleDownloadExportTicketSelectedItems,
      handleDownloadExportTicketAllItems,
    },
    isLoading: isLoadingExportTicketList || isLoadingProviderCombo,
    pagination: {
      limit: Number(queryState.size || OrderDefaultSearchSize),
      page: Number(queryState.page || OrderDefaultSearchPage),
      total: exportTicketListResponse?.totalElements || 0,
      onChange: handleChangePagination,
    },
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
    },
    reloadExportTicketList,
  };
};
