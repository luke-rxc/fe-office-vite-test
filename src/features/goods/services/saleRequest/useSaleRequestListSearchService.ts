import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { ErrorModel } from '@utils/api/createAxios';
import { PaginationResponse } from '@schemas/PaginationSchema';
import {
  SaleRequestListFormField,
  SaleRequestSearchQueryState,
  SaleRequestListModel,
  SaleRequestModifyListModel,
  SaleRequestRejectListModel,
  toSaleRequestFormFieldFromQueryState,
  toSaleRequestQueryStateFromFormField,
  toSaleRequestSearchRequest,
  toSaleRequestModelList,
  toSaleRequestModifyModelList,
  toSaleRequestRejectModelList,
  toSaleRequestOptionModelList,
} from '../../models';
import { SaleRequestListSchema, SaleRequestModifyListSchema, SaleRequestRejectListSchema } from '../../schemas';
import {
  DateType,
  ListPageSet,
  GoodsTypeCbOptions,
  SaleRequestType,
  QueryKey,
  SaleRequestMessage,
} from '../../constants';
import { postSaleRequestList, getSaleRequestOptions } from '../../apis';
import { log, getDatePresetByRange } from '../../utils';
import { useBrandService, useProviderService, useMdServices, useManagerService } from '..';
import { useManagerSaleRequest } from './useManagerSaleRequest';

const defaultFieldValue: SaleRequestListFormField = {
  name: '',
  goodsIds: '',
  typeList: GoodsTypeCbOptions.map(() => false),
  providerInfo: null,
  brandInfo: null,
  mdId: '',
  amdId: '',
  dateType: DateType.START,
  fromDate: null,
  toDate: null,
};

export const useSaleRequestListSearchService = () => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  /** Base Resource Loading */
  const [isBaseSourceLoading, setIsBaseSourceLoading] = useState(true);

  /** Set Query State */
  const { queryState, updateQueryState } = useQueryState<SaleRequestSearchQueryState>();
  const { size: querySize, page: queryPage } = queryState;
  const currentRequestType = queryState.requestType ?? SaleRequestType.SALE;

  /** List Tab */
  const [currentTab, setCurrentTab] = useState<SaleRequestType>(currentRequestType);

  /** Option */
  const [selectOptionRequestId, setSelectOptionRequestId] = useState<number | null>(null);

  /** 반려요청 Dialog */
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  /** Set API Query */
  const size = Number(querySize) || ListPageSet.size;
  const page = Number(queryPage) || ListPageSet.page;

  /** Table Row Key & Items Selection */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /** SearchForm Method */
  const methods = useForm({
    defaultValues: toSaleRequestFormFieldFromQueryState(defaultFieldValue, queryState),
  });
  const { setValue, reset } = methods;

  /** API : 리스트 검색 */
  const { data: searchLists, isLoading: isSearchLoading } = useQuery(
    [QueryKey.SaleRequest, queryState, page, size],
    () =>
      postSaleRequestList({
        params: toSaleRequestSearchRequest(queryState),
        page,
        size,
        requestType: currentRequestType,
      }),
    {
      select: (
        data,
      ): PaginationResponse<SaleRequestListModel | SaleRequestModifyListModel | SaleRequestRejectListModel> => {
        if (currentRequestType === SaleRequestType.MODIFY) {
          return toSaleRequestModifyModelList(data as PaginationResponse<SaleRequestModifyListSchema>);
        }
        if (currentRequestType === SaleRequestType.REJECT) {
          return toSaleRequestRejectModelList(data as PaginationResponse<SaleRequestRejectListSchema>);
        }
        return toSaleRequestModelList(data as PaginationResponse<SaleRequestListSchema>);
      },
      onError: (error: ErrorModel) => {
        toast.error(error?.data?.message ?? SaleRequestMessage.FAIL_SEARCH_LIST);
      },
    },
  );

  /** Api : 승인 & 반려 요청 */
  const { isPutApprovalLoading, handlePutApprovalMutate, isPutRejectLoading, handlePutRejectMutate } =
    useManagerSaleRequest();

  /** Options : 옵션 검색 */
  const { data: optionLists, isLoading: isOptionLoading } = useQuery(
    [QueryKey.SaleRequestOption, selectOptionRequestId],
    () => getSaleRequestOptions(selectOptionRequestId),
    {
      enabled: !!selectOptionRequestId,
      select: (data) => {
        return toSaleRequestOptionModelList(data);
      },
    },
  );
  // getSaleRequestOptions
  /** 기본으로 받아와야 하는 API */
  /** 브랜드 정보 */
  const { brandLists: brandListOptions, isBrandListLoading } = useBrandService();
  const initBrandId = queryState.brandId ?? '';

  /** 입점사 정보 */
  const { providerLists: providerListOptions, isProviderListLoading } = useProviderService({
    enabled: true,
  });
  const initProviderId = queryState.providerId ?? '';

  /** MD 정보 */
  const { mdList: mdListOptions, isMdListLoading } = useMdServices({
    enabled: true,
  });

  /** Manager 정보 */
  const { managerList: managerListOptions, isManagerListLoading } = useManagerService({
    enabled: true,
  });

  /** Tab Change */
  const handleTabsChange = (_: React.ChangeEvent<{}>, value: SaleRequestType): void => {
    updateQueryState({
      ...queryState,
      requestType: value,
      page: `${ListPageSet.page}`,
      size: `${ListPageSet.size}`,
    });
    setCurrentTab(value);
    handleRowReset();
  };

  /** Action : 검색 */
  const handleSearchSubmit = (values: SaleRequestListFormField) => {
    log('handleSearchSubmit', values);
    updateQueryState({
      ...queryState,
      ...toSaleRequestQueryStateFromFormField(values),
      requestType: currentRequestType,
      page: `${ListPageSet.page}`,
      size: `${ListPageSet.size}`,
    });
    handleRowReset();
  };

  /** Action : 페이지 Change - 검색 */
  const handlePageChange = (page: number, size: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: size.toString(),
    });
  };

  /** Action : Reset */
  const handleReset = () => {
    reset({
      ...defaultFieldValue,
    });

    // query state 초기화
    updateQueryState({
      ...toSaleRequestQueryStateFromFormField(defaultFieldValue),
      page: `${ListPageSet.page}`,
      size: `${ListPageSet.size}`,
    });
  };

  /** Action : 승인요청 */
  const handleApproval = () => {
    if (!selectedRowKeys.length) {
      toast.error(SaleRequestMessage.VALID_APPROVAL.NOTHING);
      return;
    }

    handlePutApprovalMutate({
      requestIds: selectedRowKeys,
      successCb: () => {
        client.invalidateQueries([QueryKey.SaleRequest, queryState, page, size]);
        handleRowReset();
      },
    });
  };

  /** Action : 반려요청 */
  const handleReject = (memo: string) => {
    if (!memo) {
      toast.error(SaleRequestMessage.VALID_REJECT.MEMO);
      return;
    }
    setIsRejectDialogOpen(false);
    handlePutRejectMutate({
      requestIds: selectedRowKeys,
      memo,
      successCb: () => {
        client.invalidateQueries([QueryKey.SaleRequest, queryState, page, size]);
        handleRowReset();
      },
    });
  };

  /** Action : 반려요청 Dialog Open */
  const handleRejectOpen = () => {
    if (!selectedRowKeys.length) {
      toast.error(SaleRequestMessage.VALID_REJECT.NOTHING);
      return;
    }
    setIsRejectDialogOpen(true);
  };

  const handleRejectClose = () => {
    setIsRejectDialogOpen(false);
  };

  /** Action 날짜 Preset */
  const handleDatePreset = (range?: number) => () => {
    const { fromDate, toDate } = getDatePresetByRange(range);

    setValue('fromDate', fromDate);
    setValue('toDate', toDate);
  };

  /** Table Row Select */
  const handleRowSelection = useCallback((selectedRowKeys: number[]) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  /** Table Row Reset */
  const handleRowReset = () => {
    setSelectedRowKeys([]);
  };

  /** 옵션 상세 보기 */
  const handleOptionOpen = (requestId: number) => {
    setSelectOptionRequestId(requestId);
  };

  const handleOptionClose = () => {
    setSelectOptionRequestId(null);
  };

  /** 브랜드 정보 */
  useEffect(() => {
    if (brandListOptions && brandListOptions.length && initBrandId) {
      setValue(
        'brandInfo',
        brandListOptions.find(({ value }) => value === +initBrandId),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initBrandId, brandListOptions]);

  /** 입점사 정보 */
  useEffect(() => {
    if (providerListOptions && providerListOptions.length && initProviderId) {
      setValue(
        'providerInfo',
        providerListOptions.find(({ value }) => value === +initProviderId),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initProviderId, providerListOptions]);

  /** 승인, 반려 로딩 */
  useEffect(() => {
    isPutApprovalLoading || isPutRejectLoading ? showLoading() : hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPutApprovalLoading, isPutRejectLoading]);

  /** base resource (provider, brand) */
  useEffect(() => {
    if (
      !isBrandListLoading &&
      !isProviderListLoading &&
      !isMdListLoading &&
      !isManagerListLoading &&
      isBaseSourceLoading
    ) {
      setIsBaseSourceLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrandListLoading, isProviderListLoading, isMdListLoading, isManagerListLoading, isBaseSourceLoading]);

  return {
    methods,
    isSearchLoading,
    searchLists: searchLists?.content,
    pagination: {
      limit: size,
      page: page,
      total: searchLists?.totalElements || 0,
      onChange: handlePageChange,
    },
    rowSelection: {
      selectedRowKeys,
      onChange: handleRowSelection,
    },
    brandListOptions,
    providerListOptions,
    mdListOptions,
    managerListOptions,
    isBaseSourceLoading,
    handleSearchSubmit,
    handleReset,
    handleDatePreset,

    // tab
    currentTab,
    handleTabsChange,

    // option
    handleOptionOpen,
    handleOptionClose,
    selectOptionRequestId,
    optionLists: selectOptionRequestId && optionLists ? optionLists : null,
    isOptionLoading,

    // 승인요청
    handleApproval,
    isPutApprovalLoading,

    // 반려요청
    handleReject,
    isPutRejectLoading,
    handleRejectOpen,
    handleRejectClose,
    isRejectDialogOpen,
  };
};
