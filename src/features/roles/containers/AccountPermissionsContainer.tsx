/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';
import { Card, CardHeader, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { PROVIDER_ROLE_LIST_LIST_TITLE, PROVIDER_ADD_BUTTON_LABEL } from '../constants';
import { useLoadingTask } from '@hooks/useLoadingTask';
import Add from '@material-ui/icons/Add';
import { IconButton } from '@components/IconButton';
import { usePrincipal } from '../hooks';
import { useProviderListService } from '../services';
import { ProviderRolesContainer } from './ProviderRolesContainer';
import { AddProviderModelContainer } from './AddProviderModelContainer';

/**
 * 계정 권한 정보 컨테이너
 */
export const AccountPermissionsContainer = (): JSX.Element => {
  const { id: accountId } = useParams();
  const { isManager } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();
  const { providerList, providerListError, isProviderListError, isProviderListLoading } = useProviderListService({
    accountId,
  });

  const [isOpenAddModal, setOpenAddModalState] = React.useState(false);

  /**
   * 관리 입점사 추가 모달 show
   */
  const showAddProviderModal = () => {
    setOpenAddModalState(true);
  };

  /**
   * 관리 입점사 추가 모달 hide
   */
  const hideAddProviderModal = () => {
    setOpenAddModalState(false);
  };

  /**
   * 관리 입점사 리스트 요청 실패시 에러 토스트 메시지 표시
   */
  React.useEffect(() => {
    isProviderListError && toast.error(providerListError.data.message);
  }, [isProviderListError]);

  /**
   * 관리 입점사 리스트 요청 여부에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isProviderListLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isProviderListLoading]);

  return (
    <>
      {/* 권한 정보 영역 헤더 */}
      <Card>
        <CardHeader
          title={PROVIDER_ROLE_LIST_LIST_TITLE}
          action={
            !isManager && <IconButton icon={<Add />} title={PROVIDER_ADD_BUTTON_LABEL} onClick={showAddProviderModal} />
          }
        />
      </Card>

      {/* 관리 입점사별 권한 리스트 */}
      {providerList.map((provider) => (
        <ProviderRolesContainer key={provider.providerId} accountId={accountId} providerInfo={provider} />
      ))}

      {/* 관리 입점사 추가 모달 */}
      {isOpenAddModal && <AddProviderModelContainer accountId={accountId} onClose={hideAddProviderModal} />}

      {/* 관리 입점사 추가 버튼 */}
      {!isManager && (
        <Button
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          variant="contained"
          startIcon={<AddIcon />}
          children={PROVIDER_ADD_BUTTON_LABEL}
          onClick={showAddProviderModal}
        />
      )}
    </>
  );
};
