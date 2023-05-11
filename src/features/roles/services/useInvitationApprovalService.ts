import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { ROLES_QUERY_KEYS } from '../constants';
import { updateInvitation, IUpdateInvitationParams } from '../apis';

/**
 * 초대 최종 승인
 */
export const useInvitationApprovalService = () => {
  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    IUpdateInvitationParams,
    unknown
  >((params) => updateInvitation(params), {
    onSuccess: () => {
      // 계정 리스트 다시가져오기
      queryClient.refetchQueries(ROLES_QUERY_KEYS.ACCOUNT_LIST, { active: true });
      // 초대 리스트 다시가져오기
      queryClient.refetchQueries(ROLES_QUERY_KEYS.INVITATION_LIST, { active: true });
    },
  });

  return {
    invitationApprovalError: error,
    isInvitationApprovalError: isError,
    isInvitationApprovalLoading: isLoading,
    isInvitationApprovalSuccess: isSuccess,
    onInvitationApproval: mutateAsync,
  };
};
