/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import _isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import {
  PROVIDER_ROLE_LIST_EDIT_CANCEL_CONFIRM_MESSAGE,
  PROVIDER_ROLE_LIST_EDIT_SUCCEED_MESSAGE,
  PROVIDER_DELETE_SUCCEED_MESSAGE,
  PROVIDER_DELETE_CONFIRM_MESSAGE,
  PROVIDER_ROLE_LIST_FIELD_NAMES,
} from '../constants';
import { useProviderUpdateService, useProviderDeleteService } from '../services';
import { ProviderItemModel } from '../models';
import { ProviderRoles, IMultiSelectProps } from '../components';

interface IProviderRolesContainerProps {
  /** 관리자 계정 ID */
  accountId: number | string;
  /** 관리 입점사 정보 */
  providerInfo: ProviderItemModel;
}

/**
 * 입점사 권한 정보 컨테이너
 */
export const ProviderRolesContainer = ({ accountId, providerInfo }: IProviderRolesContainerProps): JSX.Element => {
  const { providerId, name, isRoot, roleCategories, grantedRoles: originGrantedRoles } = providerInfo;
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();
  const { principalType, isManager } = usePrincipal();

  const prevGrantedRoles = React.useRef(null);
  const [isEdit, setEditState] = React.useState(false);
  const [grantedRoles, setGrantedRoles] = React.useState(originGrantedRoles);
  const [grantedRoleIds, setGrantedRoleIds] = React.useState(originGrantedRoles.map((role) => role.value));

  const { isProviderUpdateLoading, onProviderUpdate } = useProviderUpdateService();
  const { isProviderDeleteLoading, onProviderDelete } = useProviderDeleteService();

  const {
    control,
    reset,
    getValues,
    handleSubmit: onSubmit,
  } = useForm({
    defaultValues: { [PROVIDER_ROLE_LIST_FIELD_NAMES.IS_ROOT]: isRoot },
  });

  /**
   * 수정 모드 변환
   */
  const handelEditProviderRoles = () => setEditState(true);

  /**
   * 수정 취소
   */
  const handleCancelEditProviderRoles = () => {
    const changedValues = !(getValues('isRoot') === isRoot) || !_isEqual(originGrantedRoles, grantedRoles);

    if (changedValues) {
      if (window.confirm(PROVIDER_ROLE_LIST_EDIT_CANCEL_CONFIRM_MESSAGE)) {
        setEditState(false);
        reset({ isRoot });
        setGrantedRoles(originGrantedRoles);
        setGrantedRoleIds(originGrantedRoles.map(({ value }) => value));
      }
    } else {
      setEditState(false);
    }
  };

  /**
   * 수정 저장
   */
  const handleSaveProviderRoles = onSubmit(({ isRoot }) => {
    onProviderUpdate(
      { principalType, accountId, providerId, isRoot, roleIds: grantedRoleIds },
      {
        onError: (error) => {
          toast.error(error.data.message);
        },
        onSuccess: () => {
          toast.success(PROVIDER_ROLE_LIST_EDIT_SUCCEED_MESSAGE);
          setEditState(false);
        },
      },
    );
  });

  /**
   * 관리 입점사 제거
   */
  const handleDeleteProvider = () => {
    window.confirm(`${name} ${PROVIDER_DELETE_CONFIRM_MESSAGE}`) &&
      onProviderDelete(
        { accountId, providerId },
        {
          onError: (error) => {
            toast.error(error.data.message);
          },
          onSuccess: () => {
            toast.success(`${name} ${PROVIDER_DELETE_SUCCEED_MESSAGE}`);
          },
        },
      );
  };

  /**
   * 관리 입점사의 권한 토글
   */
  const handleToggleGrantedRoles: IMultiSelectProps['onChange'] = (roleIds, { value, label, isChecked }) => {
    if (isChecked) {
      setGrantedRoles([...grantedRoles, { value, label }]);
      setGrantedRoleIds([...grantedRoleIds, value]);
    } else {
      setGrantedRoles(grantedRoles.filter((role) => value !== role.value));
      setGrantedRoleIds([...grantedRoleIds.filter((id) => value !== id)]);
    }
  };

  /**
   * 관리 입점사의 권한 선택 취소
   */
  const handleUnselectGrantedRoles = (value: string) => {
    setGrantedRoles(grantedRoles.filter((role) => value !== role.value));
    setGrantedRoleIds([...grantedRoleIds.filter((id) => value !== id)]);
  };

  /**
   * 부여된 권한 리스트가 변경된 경우 state 업데이트
   */
  React.useEffect(() => {
    if (!_isEqual(prevGrantedRoles.current, originGrantedRoles)) {
      prevGrantedRoles.current = originGrantedRoles;

      setGrantedRoles(originGrantedRoles);
      setGrantedRoleIds(originGrantedRoles.map(({ value }) => value));
    }
  }, [originGrantedRoles]);

  /**
   * 권한 정보 수정 요청 여부에 따라 spinner show/hide
   */
  React.useEffect(() => {
    isProviderUpdateLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isProviderUpdateLoading]);

  /**
   * 관리 입점사 삭제 요청 여부에 따라 spinner show/hide
   */
  React.useEffect(() => {
    isProviderDeleteLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isProviderDeleteLoading]);

  return (
    <ProviderRoles
      isEdit={isEdit}
      isManager={isManager}
      name={name}
      roleCategories={roleCategories}
      grantedRoles={grantedRoles}
      grantedRoleIds={grantedRoleIds}
      control={control}
      onEdit={handelEditProviderRoles}
      onSave={handleSaveProviderRoles}
      onCancel={handleCancelEditProviderRoles}
      onDelete={handleDeleteProvider}
      onUnGrantedRole={handleUnselectGrantedRoles}
      onToggleGrantedRoles={handleToggleGrantedRoles}
    />
  );
};
