/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import addDays from 'date-fns/addDays';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACCOUNT_SEARCH_FIELD_NAMES } from '../constants';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import { useAccountSearchService } from '../services';
import { toAccountURLSearchModel, accountSearchFormDefaultVales } from '../models';
import { AccountSearch } from '../components';

/**
 * 계정 리스트 검색 폼 컨테이너
 */
export const AccountSearchContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { isManager } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();

  const {
    accountSearchFormValues,
    accountSearchProviderList,
    accountSearchFormError,
    isAccountSearchFormError,
    isAccountSearchFormFetched,
    isAccountSearchFormLoading,
  } = useAccountSearchService({ search });

  const {
    control,
    watch,
    reset,
    setValue,
    handleSubmit: onSubmit,
  } = useForm({ defaultValues: accountSearchFormValues });

  const [fromCreatedDate, toCreatedDate] = watch([
    ACCOUNT_SEARCH_FIELD_NAMES.FROM_CREATED_DATE,
    ACCOUNT_SEARCH_FIELD_NAMES.TO_CREATED_DATE,
  ]);

  /**
   * 계정 리스트 검색
   */
  const handleSubmit = onSubmit((values) => {
    return navigate(toAccountURLSearchModel(values, pathname + search));
  });

  /**
   * 계정 리스트 초기화
   */
  const handleReset = () => {
    reset(accountSearchFormDefaultVales);
    navigate(pathname);
  };

  /**
   * DatePicker 기간(범위) 설정
   */
  const handleDateRangePreset = (range: number) => () => {
    const fromDate = Number.isInteger(range) ? addDays(new Date(), -range).getTime() : null;
    const toDate = Number.isInteger(range) ? new Date().getTime() : null;

    setValue(ACCOUNT_SEARCH_FIELD_NAMES.FROM_CREATED_DATE, fromDate);
    setValue(ACCOUNT_SEARCH_FIELD_NAMES.TO_CREATED_DATE, toDate);
  };

  /**
   * DatePicker의 시작일과 종료일을 비교하여
   * 종료일이 시작일이 보다 작으면 값을 바꾼다.
   */
  React.useEffect(() => {
    if (fromCreatedDate && toCreatedDate && fromCreatedDate > toCreatedDate) {
      setValue(ACCOUNT_SEARCH_FIELD_NAMES.FROM_CREATED_DATE, toCreatedDate);
      setValue(ACCOUNT_SEARCH_FIELD_NAMES.TO_CREATED_DATE, fromCreatedDate);
    }
  }, [fromCreatedDate, toCreatedDate]);

  /**
   * 검색 필드 데이터 API 응답 완료시 업데이트
   */
  React.useEffect(() => {
    isAccountSearchFormFetched && reset(accountSearchFormValues);
  }, [isAccountSearchFormFetched]);

  /**
   * 검색 필드 데이터 요청 실패시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isAccountSearchFormError && toast.error(accountSearchFormError.data.message);
  }, [isAccountSearchFormError]);

  /**
   * 검색 필드 데이터 요청 상태에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isAccountSearchFormLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isAccountSearchFormLoading]);

  return (
    <AccountSearch
      isManager={isManager}
      control={control}
      providers={accountSearchProviderList}
      onSearch={handleSubmit}
      onReset={handleReset}
      onDatePreset={handleDateRangePreset}
    />
  );
};
