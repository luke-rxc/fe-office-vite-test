import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { excelExport } from '@utils/excel';
import { ErrorModel } from '@utils/api/createAxios';
import { useBrandService, useProviderService, useKeywordService } from '..';
import { log } from '../../utils';
import {
  CommonFormFieldValue,
  ListFormField,
  ListModel,
  ListSearchQueryState,
  toSearchRequest,
  toFormFieldFromQueryState,
  toQueryStateFromFormField,
  toGoodsModelList,
  toGoodsExcelModelList,
  // CategorySelectItemModel,
} from '../../models';
import { QueryKey, SearchSort, ExcelExportListHeader, ListPageSet, CommonListMessage } from '../../constants';
import { getGoods, deleteGoods, copyGoods } from '../../apis';
import { getDatePresetByRange, getListSearchAutocompleteInit } from '../../utils';
import { useManagerListBulkService } from './useManagerListBulkService';

/** Query Value set */
const defaultFieldValue: ListFormField = {
  ...CommonFormFieldValue,
  providerInfo: [],
  keywordInfo: [],
  goodsKind: null,
};

// Set CategoryInfo
/* const getInitCategoryInfo = ({
  category1,
  category2,
  category3,
}: Pick<ListSearchQueryState, 'category1' | 'category2' | 'category3'>): CategorySelectItemModel => {
  const one = category1 ? { id: +category1, name: '' } : null;
  const two = one && category2 ? { id: +category2, name: '' } : null;
  const three = two && category3 ? { id: +category3, name: '' } : null;

  return { one, two, three, primary: true };
}; */

export const useManagerListSearchService = () => {
  const client = useQueryClient();

  /** Base Resource Loading */
  const [isBaseSourceLoading, setIsBaseSourceLoading] = useState(true);

  /** Set Query State */
  const { queryState, updateQueryState } = useQueryState<ListSearchQueryState>();
  const { size: querySize, page: queryPage, sort: querySort } = queryState;

  /** Set API Query */
  const size = Number(querySize) || ListPageSet.size;
  const page = Number(queryPage) || ListPageSet.page;
  const sort = querySort || `id,${SearchSort.DESC}`;

  /** Table Row Key & Items Selection */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /** SearchForm Method */
  const methods = useForm({
    defaultValues: toFormFieldFromQueryState(defaultFieldValue, queryState),
  });

  const { setValue, reset } = methods;

  /**
   * 추가 API 정보
   */
  // 브랜드 정보
  const { brandLists: brandListOptions, isBrandListLoading } = useBrandService();
  const initBrandIds = queryState.brandIds ?? '';

  // 입점사 정보
  const { providerLists: providerListOptions, isProviderListLoading } = useProviderService({
    enabled: true,
  });
  const initProviderIds = queryState.providerIds ?? '';

  // 키워드 정보
  const { keywordList: keywordListOptions, isKeywordListLoading } = useKeywordService({
    enabled: true,
  });
  const initKeywordIds = queryState.keywordIds ?? '';

  /** 일괄수정 서식 다운로드 */
  const bulk = useManagerListBulkService({
    queryState,
  });

  /**
   * 카테고리 정보
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  /* const initCategoryItemInfo = getInitCategoryInfo(valueQueryState);
  const { categoryInfos, handleChangeCategory, isCategoryAllLoaded } = useCategoryService({
    initCategoryItemInfo: initCategoryItemInfo.one !== null ? initCategoryItemInfo : null,
  }); */

  /**
   * API : 리스트 검색
   */
  const { data: searchLists, isLoading: isSearchLoading } = useQuery(
    [QueryKey.List.SearchKey, queryState, page, size],
    () =>
      getGoods({
        goodsSearchRequest: toSearchRequest(queryState),
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
   * Action : 검색
   */
  const handleSearchSubmit = (values: ListFormField) => {
    log('handleSearchSubmit', values);
    updateQueryState({
      ...queryState,
      ...toQueryStateFromFormField(values),
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
      const res = await getGoods({
        goodsSearchRequest: toSearchRequest(queryState),
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
      ...toQueryStateFromFormField(defaultFieldValue),
      page: `${ListPageSet.page}`,
      size: `${ListPageSet.size}`,
    });
  };

  /** Action 날짜 Preset */
  const handleDatePreset = (range?: number) => () => {
    const { fromDate, toDate } = getDatePresetByRange(range);

    setValue('fromDate', fromDate);
    setValue('toDate', toDate);
  };

  /** @todo v2 에서 진행예정 */
  // Table Sorting
  // let lowestToHighest = numbers.sort((a, b) => a - b);
  // let highestToLowest = numbers.sort((a, b) => b-a);
  const handleTableSort = (orderKey, orderType) => {
    // console.log('handleTableSort', searchLists, orderKey, orderType);
    /* goods.sort((a, b) => a[orderKey] - b[orderKey]);
    (window as any).test = goods; */
  };

  /** Table Row Select */
  const handleRowSelection = useCallback((selectedRowKeys: number[], selectedItems: ListModel[]) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  /** Table Row Reset */
  const handleRowReset = () => {
    setSelectedRowKeys([]);
  };

  /**************************************************************
   * useEffect
   **************************************************************/
  /** 메인 카테고리 체크 */
  /* useEffect(() => {
    if (initCategoryItemInfo !== null && isCategoryAllLoaded) {
      const { one, two, three } = initCategoryItemInfo;
      setValue('category1', one ? one.id : '');
      setValue('category2', two ? two.id : '');
      setValue('category3', three ? three.id : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initCategoryItemInfo), isCategoryAllLoaded]); */

  /** 브랜드 정보 */
  useEffect(() => {
    if (brandListOptions && brandListOptions.length && initBrandIds) {
      const brandInfo = getListSearchAutocompleteInit(brandListOptions, initBrandIds);
      setValue('brandInfo', brandInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initBrandIds, brandListOptions]);

  /** 입점사 정보 */
  useEffect(() => {
    if (providerListOptions && providerListOptions.length && initProviderIds) {
      const providerInfo = getListSearchAutocompleteInit(providerListOptions, initProviderIds);
      setValue('providerInfo', providerInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initProviderIds, providerListOptions]);

  /** 키워드 정보 */
  useEffect(() => {
    if (keywordListOptions && keywordListOptions.length && initKeywordIds) {
      const keywordInfo = getListSearchAutocompleteInit(keywordListOptions, initKeywordIds);
      setValue('keywordInfo', keywordInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initKeywordIds, keywordListOptions]);

  /** Loading */
  useEffect(() => {
    if (!isBrandListLoading && !isKeywordListLoading && !isProviderListLoading && isBaseSourceLoading) {
      setIsBaseSourceLoading(false);
    }
  }, [isBrandListLoading, isKeywordListLoading, isProviderListLoading, isBaseSourceLoading]);

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
    bulk,
    methods,
    brandListOptions,
    isBaseSourceLoading,
    handleSearchSubmit,
    handleDuplicateTableList,
    handleDeleteTableList,
    handleAllListExport,
    handleTableSort,
    handleReset,
    handleDatePreset,

    /** Manager Office 전용 */
    providerListOptions,
    keywordListOptions,

    /* categoryInfos,
    handleChangeCategory, */
  };
};
