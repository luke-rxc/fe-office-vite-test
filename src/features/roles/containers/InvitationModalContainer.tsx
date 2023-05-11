/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import _isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import { INVITATION_REQUEST_SUCCESS_MESSAGE, INVITATION_MODAL_CLOSE_CONFIRM_MESSAGE } from '../constants';
import { mangerInviteFieldDefaultValues, partnerInviteFieldDefaultValues, inviteFieldValidation } from '../models';
import { useInvitationService } from '../services';
import { InvitationModal } from '../components';

interface IInvitationModalContainerProps {
  /** 팝업 닫기 이벤트 콜백 */
  onClose: () => void;
}

/**
 * 계정 초대 모달 컨테이너
 */
export const InvitationModalContainer = ({ onClose }: IInvitationModalContainerProps): JSX.Element => {
  const { principalType, isManager } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();

  /**
   * 초대 계정 타입에 따라 초기 폼의 기본값 분기 처리
   */
  const inviteFieldDefaultValues = isManager ? mangerInviteFieldDefaultValues : partnerInviteFieldDefaultValues;

  /**
   * 초대 신청 Service
   */
  const { invitationsError, isInvitationsError, isInvitationsLoading, isInvitationsSuccess, onInvitations } =
    useInvitationService({ principalType });

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit: onSubmit,
  } = useForm({
    defaultValues: inviteFieldDefaultValues,
    resolver: yupResolver(inviteFieldValidation),
  });

  /**
   * 계정 초대 이벤트 핸들러
   */
  const handleSubmit = onSubmit((values) => {
    return onInvitations({ principalType, ...values });
  });

  /**
   * 계정 초대 모달 닫기 이벤트 핸들러
   */
  const handleCLose = () => {
    _isEqual(inviteFieldDefaultValues, getValues())
      ? onClose()
      : window.confirm(INVITATION_MODAL_CLOSE_CONFIRM_MESSAGE) && onClose();
  };

  /**
   * 계정 초대 성공시 토스트 메시지 표시 & 팝업 닫기
   */
  React.useEffect(() => {
    if (isInvitationsSuccess) {
      toast.success(INVITATION_REQUEST_SUCCESS_MESSAGE);
      onClose();
    }
  }, [isInvitationsSuccess]);

  /**
   * 계정 초대 실패시 토스트 메시지 표시
   */
  React.useEffect(() => {
    isInvitationsError && toast.error(invitationsError.data.message);
  }, [isInvitationsError]);

  /**
   * 게정 초대 요청 여부에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isInvitationsLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isInvitationsLoading]);

  return (
    <InvitationModal
      isManager={isManager}
      control={control}
      errors={errors}
      onClose={handleCLose}
      onSubmit={handleSubmit}
    />
  );
};
