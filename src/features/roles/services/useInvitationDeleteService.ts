import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { ROLES_QUERY_KEYS } from '../constants';
import { deleteInvitation, IDeleteInvitationParams } from '../apis';

/**
 * 초대 취소
 */
export const useInvitationDeleteService = () => {
  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    IDeleteInvitationParams,
    unknown
  >((params) => deleteInvitation(params), {
    onSuccess: async () => {
      // 초대 정보 다시 가져오기
      queryClient.refetchQueries(ROLES_QUERY_KEYS.INVITATION_LIST, { active: true });
    },
  });

  return {
    invitationsDeleteError: error,
    isInvitationsDeleteError: isError,
    isInvitationsDeleteLoading: isLoading,
    isInvitationsDeleteSuccess: isSuccess,
    onInvitationsDelete: mutateAsync,
  };
};
