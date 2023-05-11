/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import {
  INVITATION_APPROVAL_FILED_NAMES,
  INVITATION_APPROVAL_SUCCESS_MASSAGE,
  INVITATION_APPROVAL_MODAL_CLOSE_CONFIRM_MESSAGE,
} from '../constants';
import { useInvitationInfoService, useInvitationApprovalService } from '../services';
import {
  ProviderComboItemModel,
  invitationApprovalFieldValidation,
  mangerInvitationApprovalFieldDefaultValues,
  partnerInvitationApprovalFieldDefaultValues,
  toInvitationApprovalParamsModel,
  toInvitationApprovalFieldValuesModel,
} from '../models';
import { InvitationApprovalModal } from '../components';

interface IInvitationApprovalModalContainerProps {
  /** 초대 ID */
  inviteId: number;
  /** 모달 닫기 이벤트 콜백 */
  onClose: () => void;
}

/**
 * 초대 승인 모달 컨테이너
 */
export const InvitationApprovalModalContainer = ({ inviteId, onClose }: IInvitationApprovalModalContainerProps) => {
  const { principalType, isManager } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();

  const {
    invitationInfo,
    InvitationInfoError,
    isInvitationInfoError,
    isInvitationInfoLoading,
    isInvitationInfoFetched,
  } = useInvitationInfoService({ principalType, inviteId });

  const {
    invitationApprovalError,
    isInvitationApprovalError,
    isInvitationApprovalSuccess,
    isInvitationApprovalLoading,
    onInvitationApproval,
  } = useInvitationApprovalService();

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    handleSubmit: onSubmit,
  } = useForm(
    isManager
      ? {
          defaultValues: mangerInvitationApprovalFieldDefaultValues,
        }
      : {
          defaultValues: partnerInvitationApprovalFieldDefaultValues,
          resolver: yupResolver(invitationApprovalFieldValidation),
        },
  );

  /**
   * roleIds 변경 이벤트 핸들러
   *
   * Transfer 컴포넌트 특성상 control를 사용할수 없어서 이벤트 핸들러로 Props를
   * 전달받아 수동으로 react-hook-form의 값을 변경.
   */
  const handleChangeRoleIds = (unselectedIds: number[], selectedIds: number[]) => {
    setValue(INVITATION_APPROVAL_FILED_NAMES.ROLE_IDS, selectedIds);
  };

  /**
   * providerId 변경 이벤트 핸들러
   *
   * material ui 구조상 control을 사용하기에 이슈가 있어 이벤트 핸들러로 Props를
   * 전달받아 수동으로 react-hook-form의 값을 변경.
   */
  const handleChangeProviderId = (provider: ProviderComboItemModel) => {
    setValue(
      INVITATION_APPROVAL_FILED_NAMES.PROVIDER_ID,
      provider?.id || partnerInvitationApprovalFieldDefaultValues.providerId,
    );
  };

  /**
   * 초대 승인 모달 닫기 이벤트 핸들러
   */
  const handleClose = () => {
    window.confirm(INVITATION_APPROVAL_MODAL_CLOSE_CONFIRM_MESSAGE) && onClose();
  };

  /**
   * 초대 승인 이벤트 핸들러
   */
  const handleSubmit = onSubmit((values) => {
    onInvitationApproval(toInvitationApprovalParamsModel({ principalType, inviteId, accountInfo: values }));
  });

  /**
   * 초대 승인 성공시 모달 닫기
   */
  React.useEffect(() => {
    if (isInvitationApprovalSuccess) {
      toast.success(INVITATION_APPROVAL_SUCCESS_MASSAGE);
      onClose();
    }
  }, [isInvitationApprovalSuccess]);

  /**
   * 초대 승인 실패시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isInvitationApprovalError && toast.error(invitationApprovalError.data.message);
  }, [isInvitationApprovalError]);

  /**
   * 초대 승인 요청 여부에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isInvitationApprovalLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isInvitationApprovalLoading]);

  /**
   * 초대 정보 요청 성공시 폼 데이터 업데이트
   */
  React.useEffect(() => {
    isInvitationInfoFetched && reset(toInvitationApprovalFieldValuesModel(invitationInfo));
  }, [isInvitationInfoFetched]);

  /**
   * 초대 정보 요청 실패시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isInvitationInfoError && toast.error(InvitationInfoError.data.message);
  }, [isInvitationInfoError]);

  /**
   * 초대 정보 요청 여부에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isInvitationInfoLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isInvitationInfoLoading]);

  return (
    <InvitationApprovalModal
      isManager={isManager}
      control={control}
      errors={errors}
      roles={invitationInfo.roles}
      providers={invitationInfo.providerComboList}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onChangeRoleIds={handleChangeRoleIds}
      onChangeProviderId={handleChangeProviderId}
    />
  );
};
