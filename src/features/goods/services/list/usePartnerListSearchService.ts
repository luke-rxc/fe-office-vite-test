import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ErrorModel } from '@utils/api/createAxios';
import { excelExport } from '@utils/excel';
import { useBrandService } from '..';
import { log, getListSearchAutocompleteInit } from '../../utils';
import {
  CommonFormFieldValue,
  PartnerListFormField,
  ListModel,
  PartnerListSearchQueryState,
  toPartnerSearchRequest,
  toPartnerFormFieldFromQueryState,
  toPartnerQueryStateFromFormField,
  toGoodsModelList,
  toGoodsExcelModelList,
} from '../../models';
import {
  QueryKey,
  SearchSort,
  ExcelExportListHeader,
  RequestStatusCbOptions,
  ListPageSet,
  CommonListMessage,
  PartnerListMessage,
} from '../../constants';
import { getPartnerGoods, copyGoods, deleteGoods } from '../../apis';
import { getDatePresetByRange } from '../../utils';
import { usePartnerSaleRequest } from '../saleRequest';

/** Query Value set */
const defaultFieldValue: PartnerListFormField = {
  ...CommonFormFieldValue,
  requestStatusList: RequestStatusCbOptions.map(() => false),
};

export const usePartnerListSearchService = () => {
  const client = useQueryClient();

  /** Base Resource Loading */
  const [isBaseSourceLoading, setIsBaseSourceLoading] = useState(true);

  /** Set Query State */
  const { queryState, updateQueryState } = useQueryState<PartnerListSearchQueryState>();
  const { size: querySize, page: queryPage, sort: querySort } = queryState;

  /** Set API Query */
  const size = Number(querySize) || ListPageSet.size;
  const page = Number(queryPage) || ListPageSet.page;
  const sort = querySort || `id,${SearchSort.DESC}`;

  /** Table Row Key & Items Selection */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /** SearchForm Method */
  const methods = useForm({
    defaultValues: toPartnerFormFieldFromQueryState(defaultFieldValue, queryState),
  });

  const { setValue, reset } = methods;

  /**
   * 추가 API 정보
   */
  // 브랜드 정보
  const { brandLists: brandListOptions, isBrandListLoading } = useBrandService();
  const initBrandIds = queryState.brandIds ?? '';

  /**
   * API : 리스트 검색
   */
  const { data: searchLists, isLoading: isSearchLoading } = useQuery(
    [QueryKey.List.SearchKey, queryState, page, size],
    () =>
      getPartnerGoods({
        goodsSearchRequest: toPartnerSearchRequest(queryState),
        page,
        size,
        sort,
      }),
    {
      cacheTime: 0,
      select: (data): PaginationResponse<ListModel> => toGoodsModelList(data),
      onError: (error: ErrorModel) => {
        toast.error(error?.data?.message ?? CommonListMessage.FAIL_SEARCH_LIST);
      },
    },
  );

  /**
   * API : 리스트 복제
   */
  const { mutateAsync: duplicateTableListMutate } = useMutation(
    (goodsId: number) =>
      copyGoods({
        goodsId,
      }),
    {
      onSuccess: () => {
        toast.success(CommonListMessage.SUCCESS_DUPLICATE_LIST);
        client.invalidateQueries([QueryKey.List.SearchKey, queryState]);
        handleRowReset();
      },
      onError: (error: ErrorModel) => {
        toast.error(error?.data?.message ?? CommonListMessage.FAIL_DUPLICATE_LIST);
      },
    },
  );

  /**
   * API : 리스트 삭제
   */
  const { mutateAsync: deleteTableListMutate } = useMutation(
    (goodsId: number) =>
      deleteGoods({
        goodsId,
      }),
    {
      onSuccess: () => {
        toast.success(CommonListMessage.SUCCESS_DELETE_LIST);
        client.invalidateQueries([QueryKey.List.SearchKey, queryState, page, size]);
        handleRowReset();
      },
      onError: (error: ErrorModel) => {
        toast.error(error?.data?.message ?? CommonListMessage.FAIL_DELETE_LIST);
      },
    },
  );

  /**
   * API : 승인 요청
   */
  const { handlePartnerSaleRequest } = usePartnerSaleRequest();

  /**
   * Action : 검색
   */
  const handleSearchSubmit = (values: PartnerListFormField) => {
    log('handleSearchSubmit', values);
    updateQueryState({
      ...queryState,
      ...toPartnerQueryStateFromFormField(values),
      page: `${ListPageSet.page}`,
      size: `${ListPageSet.size}`,
    });
  };

  /** Action : 페이지 Change - 검색 */
  const handlePageChange = (page: number, size: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: size.toString(),
    });
  };

  /** Action : 복제 */
  const handleDuplicateTableList = useCallback(async () => {
    if (!selectedRowKeys.length) {
      toast.error(CommonListMessage.VALID_DUPLICATE.NOTHING);
      return;
    }
    if (selectedRowKeys.length !== 1) {
      toast.error(CommonListMessage.VALID_DUPLICATE.ONCE);
      return;
    }
    await duplicateTableListMutate(selectedRowKeys[0]);
  }, [duplicateTableListMutate, selectedRowKeys]);

  /** Action : 삭제 */
  const handleDeleteTableList = async () => {
    if (!selectedRowKeys.length) {
      toast.error(CommonListMessage.VALID_DELETE_LIST.NOTHING);
      return;
    }
    if (selectedRowKeys.length !== 1) {
      toast.error(CommonListMessage.VALID_DELETE_LIST.ONCE);
      return;
    }
    await deleteTableListMutate(selectedRowKeys[0]);
  };

  /** Action : export */
  const handleAllListExport = async () => {
    const searchListTotal = searchLists?.totalElements ?? 0;
    if (searchListTotal === 0) {
      toast.error(CommonListMessage.FAIL_EXPORT_LIST);
      return;
    }
    try {
      const res = await getPartnerGoods({
        goodsSearchRequest: toPartnerSearchRequest(queryState),
        page: 1,
        size: searchListTotal,
        sort,
      });
      const allData = toGoodsExcelModelList(res);
      if (allData?.content && allData?.content?.length > 0) {
        excelExport({
          sheetData: allData.content,
          headers: [ExcelExportListHeader],
          autoFit: true,
          autoFitRatio: 1.2,
        });
      }
    } catch (e) {
      toast.error(CommonListMessage.FAIL_EXPORT_LIST);
    }
  };

  /** Action : Reset */
  const handleReset = () => {
    reset({
      ...defaultFieldValue,
    });

    // query state 초기화
    updateQueryState({
      ...toPartnerQueryStateFromFormField(defaultFieldValue),
      page: `${ListPageSet.page}`,
      size: `${ListPageSet.size}`,
    });
  };

  /** Action : 승인요청 */
  const handleSaleRequest = () => {
    log('handleSaleRequest', selectedRowKeys);
    if (!selectedRowKeys.length) {
      toast.error(PartnerListMessage.VALID_SALE_REQUEST.NOTHING);
      return;
    }

    handlePartnerSaleRequest({
      goodsIds: selectedRowKeys,
      successCb: () => {
        client.invalidateQueries([QueryKey.List.SearchKey, queryState, page, size]);
        handleRowReset();
      },
    });
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

  /** 브랜드 정보 */
  useEffect(() => {
    if (brandListOptions && brandListOptions.length && initBrandIds) {
      const brandInfo = getListSearchAutocompleteInit(brandListOptions, initBrandIds);
      setValue('brandInfo', brandInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initBrandIds, brandListOptions]);

  /** Loading */
  useEffect(() => {
    if (!isBrandListLoading && isBaseSourceLoading) {
      setIsBaseSourceLoading(false);
    }
  }, [isBrandListLoading, isBaseSourceLoading]);

  return {
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
    methods,
    brandListOptions,
    isBaseSourceLoading,
    handleSearchSubmit,
    handleDuplicateTableList,
    handleDeleteTableList,
    handleAllListExport,
    handleReset,
    handleSaleRequest,
    handleDatePreset,
  };
};
