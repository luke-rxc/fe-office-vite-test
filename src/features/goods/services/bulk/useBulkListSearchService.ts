import { useEffect, useState, useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { ErrorModel } from '@utils/api/createAxios';
import { PaginationResponse } from '@schemas/PaginationSchema';
import {
  BulkListFormField,
  BulkListSearchQueryState,
  BulkListModel,
  toBulkQueryStateFromFormField,
  toBulkFormFieldFromQueryState,
  toBulkModelList,
  toBulkListSearchRequestParams,
} from '../../models';
import { BulkSearchType, BulkStatusTypeCbOptions, QueryKey } from '../../constants';
import { log } from '../../utils';
import { postBulkList, postCancelBulkList } from '../../apis';
import { useBrandService, useProviderService } from '..';

/** Base Page set */
const pageSet = {
  page: 1,
  size: 10,
};
/**
 * 상품 일괄수정 > 검색 Field Init Value
 */
const defaultFieldValue: BulkListFormField = {
  searchType: BulkSearchType.TITLE,
  keyword: '',
  providerInfo: null,
  brandInfo: null,
  statusList: BulkStatusTypeCbOptions.map(() => false),
  fromDate: null,
  toDate: null,
};

export const useBulkListSearchService = () => {
  const client = useQueryClient();

  /** Base Resource Loading */
  const [isBaseResrcLoading, setIsBaseResrcLoading] = useState(true);

  /** Set Query State */
  const { queryState, updateQueryState } = useQueryState<BulkListSearchQueryState>();
  const { size: querySize, page: queryPage } = queryState;

  /** Set API Query */
  const size = Number(querySize) || pageSet.size;
  const page = Number(queryPage) || pageSet.page;

  /** Table Row Key & Items Selection */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedRowItems, setSelectedRowItems] = useState<BulkListModel[]>([]);

  /** SearchForm Method */
  const formMethod = useForm({
    defaultValues: toBulkFormFieldFromQueryState(defaultFieldValue, queryState),
  });
  const { reset, setValue } = formMethod;

  /** API : 리스트 검색 */
  const { data: searchLists, isLoading: isSearchLoading } = useQuery(
    [QueryKey.BulkList, queryState, page, size],
    () =>
      postBulkList({
        params: toBulkListSearchRequestParams(queryState),
        page,
        size,
      }),
    {
      cacheTime: 0,
      select: (data): PaginationResponse<BulkListModel> => toBulkModelList(data),
      onError: (error: ErrorModel) => {
        toast.error(error.data.message ?? '리스트 검색이 실패하였습니다.\r\n다시 한번 시도해 주세요');
      },
    },
  );

  /** API : 리스트 취소 */
  const { mutateAsync: cancelListMutate } = useMutation(
    (ids: number[]) =>
      postCancelBulkList({
        ids,
      }),
    {
      onSuccess: () => {
        toast.success('예약 취소가 완료되었습니다');
        handleRowReset();
        handleListRefresh();
      },
      onError: (error: ErrorModel) => {
        toast.error(error.data.message ?? '예약 취소가 실패하였습니다.\r\n다시 한번 시도해 주세요');
      },
    },
  );

  /** 리스트 갱신 */
  const handleListRefresh = () => {
    client.invalidateQueries([QueryKey.BulkList, queryState, page, size]);
  };

  /** Table Row Select */
  const handleRowSelection = useCallback((selectedRowKeys: number[], selectedItems: BulkListModel[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRowItems(selectedItems);
  }, []);

  /** Table Row Reset */
  const handleRowReset = () => {
    setSelectedRowKeys([]);
    setSelectedRowItems([]);
  };

  /** 기본으로 받아와야 하는 API */
  /** 브랜드 정보 */
  const { brandLists: brandListOptions, isBrandListLoading } = useBrandService();
  const initBrandId = queryState.brandId ?? '';

  /** 입점사 정보 */
  const { providerLists: providerListOptions, isProviderListLoading } = useProviderService({
    enabled: true,
  });
  const initProviderId = queryState.providerId ?? '';

  /** Action : Reset */
  const handleReset = () => {
    log('[handleReset]');

    reset({
      ...defaultFieldValue,
    });

    // query state 초기화
    updateQueryState({
      ...toBulkQueryStateFromFormField(defaultFieldValue),
      page: `${pageSet.page}`,
      size: `${pageSet.size}`,
    });
  };

  /** Action : 검색(기본) - updateQueryState */
  const handleSearchSubmit = (values: BulkListFormField) => {
    log('[handleSearchSubmit]', values);
    log('[handleSearchSubmit]queryState::', queryState);

    updateQueryState({
      ...queryState,
      ...toBulkQueryStateFromFormField(values),
      page: `${pageSet.page}`,
      size: `${pageSet.size}`,
    });
  };

  /** Action : 검색(페이지 Change) - updateQueryState  */
  const handlePageChange = (page: number, size: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: size.toString(),
    });
  };

  /** Action : 예약 취소(대기상태만 진행) */
  const handleCancelList = async () => {
    // 한개도 선택되지 않은 상태에서는 동작 중지
    if (selectedRowItems.length === 0) {
      return;
    }

    const includeCancelNotAble = selectedRowItems.some(({ isStandBy }) => !isStandBy);

    // 대기 상태에서만 삭제
    if (includeCancelNotAble) {
      toast.error('예약 및 대기상태만 취소가능 합니다');
      return;
    }

    const cancelListIds = selectedRowItems.map(({ id }) => id);
    await cancelListMutate(cancelListIds);
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

  /** base resource (provider, brand) */
  useEffect(() => {
    if (!isBrandListLoading && !isProviderListLoading && isBaseResrcLoading) {
      setIsBaseResrcLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrandListLoading, isProviderListLoading, isBaseResrcLoading]);

  return {
    formMethod,
    handleSearchSubmit,
    handleCancelList,
    handleReset,
    handleListRefresh,
    isBaseResrcLoading,
    brandListOptions,
    providerListOptions,
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
  };
};
