/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import { toAccountURLSearchModel } from '../models';
import { useAccountListService } from '../services';
import { AccountList } from '../components';

/**
 * 계정 리스트 테이블 컨테이너
 */
export const AccountListContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { principalType, isManager } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();

  const {
    accountList,
    accountListTotal,
    accountListSize,
    accountListPage,
    accountListError,
    isAccountListError,
    isAccountListLoading,
  } = useAccountListService({ principalType, search });

  /**
   * 페이지 인덱스 변경시 URL Query String 업데이트
   */
  const handleChangePagination = (page: number, size: number) => {
    !(accountListSize === size && accountListPage === page) && accountListPage === page
      ? navigate(toAccountURLSearchModel({ size }, pathname + search))
      : navigate(toAccountURLSearchModel({ size, page }, pathname + search));
  };

  /**
   * 계정 리스트 요청 실패시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isAccountListError && toast.error(accountListError.data.message);
  }, [isAccountListError]);

  /**
   * 계정 리스트 요청 상태에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isAccountListLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isAccountListLoading]);

  return (
    <AccountList
      isManager={isManager}
      accountList={accountList}
      accountListTotal={accountListTotal}
      accountListSize={accountListSize}
      accountListPage={accountListPage}
      onChangePagination={handleChangePagination}
    />
  );
};
