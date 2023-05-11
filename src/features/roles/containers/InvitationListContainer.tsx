/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import toast from 'react-hot-toast';
import { INVITATION_DELETE_SUCCESS_MASSAGE, INVITATION_CANCEL_CONFIRM_MASSAGE } from '../constants';
import { useLoadingTask } from '@hooks/useLoadingTask';
import { usePrincipal } from '../hooks';
import { InvitationItemModel } from '../models';
import { useInvitationListService, useInvitationDeleteService } from '../services';
import { InvitationList } from '../components';
import { InvitationApprovalModalContainer } from './InvitationApprovalModalContainer';

/**
 * 계정 초대 리스트 컨테이너
 */
export const InvitationListContainer = () => {
  const { principalType, isManager } = usePrincipal();
  const { increaseLoadingTask, decreaseLoadingTask } = useLoadingTask();
  const { 0: selectedInviteId, 1: setSelectedInviteId } = React.useState<number>(null);

  /**
   * 초대 리스트
   */
  const { invitationList, invitationListError, isInvitationListError, isInvitationListLoading } =
    useInvitationListService({ principalType });

  /**
   * 초대 취소
   */
  const {
    invitationsDeleteError,
    isInvitationsDeleteError,
    isInvitationsDeleteSuccess,
    isInvitationsDeleteLoading,
    onInvitationsDelete,
  } = useInvitationDeleteService();

  /**
   * 초대 승인 모달 활성화
   */
  const showInvitationApprovalModal = ({ id }: InvitationItemModel) => {
    return () => {
      setSelectedInviteId(id);
    };
  };

  /**
   * 초대 승인 모달 닫기
   */
  const hideInvitationApprovalModal = () => {
    setSelectedInviteId(null);
  };

  /**
   * 초대 취소 이벤트 핸들러
   */
  const handleCancelInvitation = ({ name, email, id }: InvitationItemModel) => {
    return () => {
      if (window.confirm(`${name}(${email})${INVITATION_CANCEL_CONFIRM_MASSAGE}`)) {
        onInvitationsDelete({ inviteId: id });
      }
    };
  };

  /**
   * 초대 리스트 요청 실패시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isInvitationListError && toast.error(invitationListError.data.message);
  }, [isInvitationListError]);

  /**
   * 초대 리스트 요청 여부에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isInvitationListLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isInvitationListLoading]);

  /**
   * 초대 취소 요청 성공시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isInvitationsDeleteSuccess && toast.success(INVITATION_DELETE_SUCCESS_MASSAGE);
  }, [isInvitationsDeleteSuccess]);

  /**
   * 초대 취소 요청 실패시 토스트 메시지 노출
   */
  React.useEffect(() => {
    isInvitationsDeleteError && toast.error(invitationsDeleteError.data.message);
  }, [isInvitationsDeleteError]);

  /**
   * 초대 취소 요청 여부에 따라 Spinner show/hide
   */
  React.useEffect(() => {
    isInvitationsDeleteLoading ? increaseLoadingTask() : decreaseLoadingTask();
  }, [isInvitationsDeleteLoading]);

  return (
    <>
      {/* 초대 리스트 */}
      <InvitationList
        isManager={isManager}
        invitationList={invitationList}
        onInvitationCancel={handleCancelInvitation}
        onInvitationApproval={showInvitationApprovalModal}
      />

      {/* 초대 승인 모달 */}
      {selectedInviteId && (
        <InvitationApprovalModalContainer inviteId={selectedInviteId} onClose={hideInvitationApprovalModal} />
      )}
    </>
  );
};
