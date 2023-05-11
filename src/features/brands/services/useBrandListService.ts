import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { stringifyUrl, StringifyOptions } from 'query-string';
import addDays from 'date-fns/addDays';
import { SortOrderType } from '@constants/table';
import { useQuery } from '@hooks/useQuery';
import { getBrands } from '../apis';
import { SearchType, SearchDateType } from '../constants';
import type { BaseListSchema } from '../schemas';
import { BrandListParams, toBrandListModel, BrandModel } from '../models';
import { extractValidParams } from '../utils';

const defaultParams: BrandListParams = {
  searchDateType: SearchDateType.ALL,
  fromDate: null,
  toDate: null,
  searchType: SearchType.NAME,
  keyWord: '',
  page: 1,
  size: 25,
  sort: ['id', SortOrderType.DESC],
};

export const useBrandListService = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // QueryString Overrides 처리
  const updateQueryString = (
    { url = `${pathname}${search}`, query = {} },
    options: StringifyOptions = { arrayFormat: 'comma', skipEmptyString: true, skipNull: true },
  ) => navigate(stringifyUrl({ url, query }, options));

  // 유효 파라미터
  const validParams = extractValidParams(search, { parseNumbers: true, arrayFormat: 'comma' });

  // 검색 기간 조건
  const searchDateType = validParams.fromDate && validParams.toDate ? SearchDateType.CREATED_DATE : SearchDateType.ALL;

  // 전체 파라미터
  const entireParams = { ...defaultParams, ...validParams, searchDateType };

  const {
    fromDate,
    toDate,
    searchType,
    keyWord,
    page,
    size: limit,
    sort: [orderKey, orderType],
  } = entireParams;

  // data fetch
  const { isLoading, data } = useQuery(['brands', entireParams], () => getBrands(extractValidParams(entireParams)), {
    select: (data): BaseListSchema<BrandModel> => ({ ...data, content: toBrandListModel(data.content) }),
    onError: (error) => {
      toast.error(error.data?.message ?? '브랜드 조회 오류가 발생하였습니다');
    },
  });

  // managing forms
  const formValues = { fromDate, toDate, searchType, keyWord };
  const {
    control,
    reset,
    getValues,
    setValue,
    handleSubmit: handleFormSubmit,
  } = useForm({ defaultValues: formValues });

  /**
   * Filter Rules
   * @memberof filter
   */
  const rules = {
    fromDate: {
      validate: (fromDate: number) => fromDate <= getValues('toDate') || '잘못된 일자입니다.',
    },
    toDate: {
      validate: (toDate: number) => getValues('fromDate') <= toDate || '잘못된 일자입니다.',
    },
  };

  /**
   * Filter Date Range Handler
   * @memberof filter
   */
  const handleSelectDateRange = (range?: number) => () => {
    const today = new Date();
    const isPositiveOrZero = Math.sign(range) >= 0;
    const fromDate = isPositiveOrZero ? addDays(today, -range).getTime() : null;
    const toDate = isPositiveOrZero ? today.getTime() : null;

    setValue('fromDate', fromDate);
    setValue('toDate', toDate);
  };

  /**
   * Filter Submit Handler
   * @memberof filter
   */
  const handleSubmit = handleFormSubmit((data) => updateQueryString({ query: { ...data, page: 1 } }));

  /**
   * Filter Reset Handler
   * @memberof filter
   */
  const handleReset = () => {
    const { fromDate, toDate, searchType, keyWord } = defaultParams;
    reset({ fromDate, toDate, searchType, keyWord });
  };

  /**
   * Pagination Handler
   * @memberof pagination
   */
  const handleChangePagination = (page: number, limit: number) => updateQueryString({ query: { page, size: limit } });

  /**
   * Sort Handler
   * @memberof sort
   */
  const handleSort = (orderKey: string, orderType: SortOrderType) =>
    updateQueryString({ query: { sort: [orderKey, orderType] } });

  return {
    filter: {
      control,
      rules,
      handleSelectDateRange,
      handleSubmit,
      handleReset,
    },
    isLoading,
    brandList: data?.content || [],
    pagination: {
      page,
      limit,
      total: data?.totalElements || 0,
      onChange: handleChangePagination,
    },
    rowKey: 'id',
    sort: {
      orderKey,
      orderType,
      handleSort,
    },
  };
};
