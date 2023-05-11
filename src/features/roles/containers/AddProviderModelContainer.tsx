/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import _isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import { useProviderAddService } from '../services';
import {
  ADD_PROVIDER_FILED_NAMES,
  ADD_PROVIDER_SUCCESS_MESSAGE,
  ADD_PROVIDER_MODAL_CLOSE_CONFIRM_MESSAGE,
} from '../constants';
import { addProviderFiledDefaultValues, addProviderFieldValidation } from '../models';
import { AddProvider } from '../components';

interface IAddProviderModelContainerProps {
  accountId: number | string;
  onClose: () => void;
}

/**
 * 관리 입점사 추가 모달 컨테이너
 */
export const AddProviderModelContainer = ({ accountId, onClose }: IAddProviderModelContainerProps): JSX.Element => {
  const { principalType } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();
  const { roleList, providerComboList, providerAddError, isProviderAddError, isProviderAddLoading, onProviderAdd } =
    useProviderAddService({ principalType });

  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: addProviderFiledDefaultValues,
    resolver: yupResolver(addProviderFieldValidation),
  });

  /**
   * 팝업닫기 이벤트 핸들러
   */
  const handleClose = () => {
    if (_isEqual(getValues(), addProviderFiledDefaultValues)) {
      onClose();
    } else {
      window.confirm(ADD_PROVIDER_MODAL_CLOSE_CONFIRM_MESSAGE) && onClose();
    }
  };

  /**
   * 입점사 등록 이벤트 핸들러
   */
  const handleAddProvider = handleSubmit((values) => {
    onProviderAdd(
      { principalType, accountId, ...values },
      {
        onSuccess: () => {
          toast.success(ADD_PROVIDER_SUCCESS_MESSAGE);
          handleClose();
        },
      },
    );
  });

  /**
   * 입점사 변경 이벤트 핸들러
   */
  const handleChangeProviderId = ({ id }) => {
    setValue(ADD_PROVIDER_FILED_NAMES.PROVIDER_ID, id || null);
  };

  /**
   * 입점서 권한 리스트 변경 이벤트 핸들러
   */
  const handleChangeRoleIds = (unselectedIds, selectedIds) => {
    setValue(ADD_PROVIDER_FILED_NAMES.ROLE_IDS, selectedIds);
  };

  /**
   * 관리 입점사 등록 / 관련 데이터 요청 실패시 토스트 메시지 표시
   */
  React.useEffect(() => {
    isProviderAddError && toast.error(providerAddError.data.message);
  }, [isProviderAddError]);

  /**
   * 관리 입점사 등록 / 관련 데이터 요청 여부에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isProviderAddLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isProviderAddLoading]);

  return (
    <AddProvider
      control={control}
      errors={errors}
      roleList={roleList}
      providerComboList={providerComboList}
      onChangeProviderId={handleChangeProviderId}
      onChangeRoleIds={handleChangeRoleIds}
      onClose={handleClose}
      onSubmit={handleAddProvider}
    />
  );
};
