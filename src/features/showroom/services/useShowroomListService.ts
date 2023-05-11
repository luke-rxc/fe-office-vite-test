/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { stringifyUrl } from '../utils';
import {
  ShowroomSearchFieldDefaultValues,
  ShowroomSearchTypeOptionsForSearch,
  ShowroomDateTypeOptionsForSearch,
  ShowroomStatusForOptionsSearch,
  ShowroomTypeOptionsForSearch,
} from '../constants';
import { ShowroomSearchFields, ShowroomSearchFieldOptions } from '../types';
import { toShowroomSearchFieldsModel, toShowroomSearchQueryModel } from '../models';
import { useShowroomListQuery, useKeywordComboListQuery } from './queries';

/**
 * 쇼룸 목록 조회 Service
 */
export const useShowroomListService = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  /**
   * 목록 검색 값 === 현재 검색결과의 Field Value
   */
  const [searchValues, setSearchValues] = useState<ShowroomSearchFields>(toShowroomSearchFieldsModel(search));

  /**
   * 검색 필드 값 === 현재 Field에 입력되어 있는 Value
   */
  const formMethods = useForm<ShowroomSearchFields>({ defaultValues: searchValues });

  /**
   * 목록 조회 Query
   */
  const listQuery = useShowroomListQuery(searchValues);

  /**
   * 키워드 콤보 Query
   */
  const keywordsComboQuery = useKeywordComboListQuery();

  /**
   * 검색 필드 옵션
   */
  const formOptions: ShowroomSearchFieldOptions = {
    searchType: ShowroomSearchTypeOptionsForSearch,
    dateType: ShowroomDateTypeOptionsForSearch,
    status: ShowroomStatusForOptionsSearch,
    type: ShowroomTypeOptionsForSearch,
    keywords: keywordsComboQuery?.data || [],
  };

  /**
   * 검색 업데이트
   */
  const updateSearch = (values: ShowroomSearchFields, queryClear?: boolean) => {
    formMethods.reset(values);
    setSearchValues(values);
    // querystring update
    navigate(stringifyUrl({ url: pathname, query: queryClear ? {} : toShowroomSearchQueryModel(values) }));
  };

  /**
   * 쇼룸 검색
   */
  const handleSearch = formMethods.handleSubmit((values) => {
    updateSearch({ ...values, page: ShowroomSearchFieldDefaultValues.page });
  });

  /**
   * 검색 필드 초기화
   */
  const handleResetSearchForm = () => {
    updateSearch(ShowroomSearchFieldDefaultValues, true);
  };

  /**
   * pagination 변경
   */
  const handleChangePagination = useCallback(
    (page: number, size: number) => {
      updateSearch({ ...searchValues, size, page });
    },
    [searchValues],
  );

  /**
   * 쇼룸 타입 변경
   */
  const handleChangeShowroomType = useCallback(
    (type: ShowroomSearchFields['type']) => {
      updateSearch({ ...searchValues, type, page: ShowroomSearchFieldDefaultValues.page });
    },
    [searchValues],
  );

  return {
    list: listQuery?.data?.content || [],
    total: listQuery?.data?.totalElements || 0,
    isLoading: listQuery.isLoading,
    formMethods,
    formOptions,
    handler: {
      search: handleSearch,
      searchReset: handleResetSearchForm,
      changePagination: handleChangePagination,
      ChangeShowroomType: handleChangeShowroomType,
    },
  };
};
