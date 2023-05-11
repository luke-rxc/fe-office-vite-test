import { useQueryState } from '@hooks/useQueryState';
import { addDays, isDate } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { defaultSearchPage, defaultSearchSize, RaffleEventListSearchField } from '../constants';
import { useRaffleEventListQuery } from '../hooks';
import {
  toRaffleEventListSearchParamsByQueryState,
  toRaffleEventListSearchFormFieldByQueryState,
  toRaffleEventSearchQueryStateByFormField,
} from '../models';
import { RaffleEventListQueryState, RaffleEventListSearchFormField } from '../types';

export type ReturnTypeUseRaffleEventListService = ReturnType<typeof useRaffleEventListService>;

const defaultFormValues: RaffleEventListSearchFormField = {
  searchField: RaffleEventListSearchField.RAFFLE_NAME,
  keyword: '',
  startDate: null,
  endDate: null,
};

export const useRaffleEventListService = () => {
  const { queryState, updateQueryState } = useQueryState<RaffleEventListQueryState>();

  const formMethod = useForm<RaffleEventListSearchFormField>({
    defaultValues: toRaffleEventListSearchFormFieldByQueryState(queryState, defaultFormValues),
  });

  const { reset, setValue, handleSubmit: handleSearchSubmit } = formMethod;

  useEffect(() => {
    reset(toRaffleEventListSearchFormFieldByQueryState(queryState, defaultFormValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState]);

  const { data: raffleEventListResponse, isLoading: isLoadingRaffleEventList } = useRaffleEventListQuery(
    toRaffleEventListSearchParamsByQueryState(queryState, defaultFormValues),
  );

  const getDateValues = (dateValue: string | number) => {
    return Number.isInteger(dateValue) ? dateValue : isDate(dateValue) ? new Date(dateValue).getTime() : undefined;
  };

  /**
   * 검색 submit
   */
  const handleSubmit = handleSearchSubmit((values) => {
    const startDate = getDateValues(values.startDate);
    const endDate = getDateValues(values.endDate);

    // const oneDay = 1000 * 60 * 60 * 24;
    // const difference_ms = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    // const diffValue = Math.round(difference_ms / oneDay);

    const syncQueryState = toRaffleEventSearchQueryStateByFormField(
      {
        ...values,
        startDate,
        endDate,
      },
      queryState,
    );

    updateQueryState({
      ...syncQueryState,
      page: defaultSearchPage,
      size: defaultSearchSize,
    });
  });

  /**
   * 검색 필터 초기화
   */
  const handleReset = () => {
    reset(defaultFormValues);
    updateQueryState(toRaffleEventSearchQueryStateByFormField(defaultFormValues, queryState));
  };

  /**
   * 방송일 날짜 필터 범위 변경
   */
  const handleChangeLiveRange = (range: number) => {
    const fromDate = Number.isInteger(range) ? new Date().getTime() : null;
    const toDate = Number.isInteger(range) ? addDays(new Date(), range).getTime() : null;

    setValue('startDate', fromDate);
    setValue('endDate', toDate);
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
   * 대시보드 페이지 열기
   */
  const handleClickOpenDashboard = (liveId: string) => {
    return () => {
      window.open(`/showtime/manage/dashboard/${liveId}/raffle_event`, '_blank');
    };
  };

  return {
    raffleEventList: raffleEventListResponse?.content ?? [],
    isLoading: isLoadingRaffleEventList,
    form: {
      formMethod,
      handleSubmit,
      handleReset,
      handleChangeLiveRange,
    },
    pagination: {
      limit: Number(queryState.size || defaultSearchSize),
      page: Number(queryState.page || defaultSearchPage),
      total: raffleEventListResponse?.totalElements ?? 0,
      onChange: handleChangePagination,
    },
    handleClickOpenDashboard,
  };
};
