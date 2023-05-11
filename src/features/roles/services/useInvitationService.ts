import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { ROLES_QUERY_KEYS } from '../constants';
import { createInvitation, ICreateInvitationParams } from '../apis';

/**
 * 초대 하기
 */
export const useInvitationService = ({ principalType }: Pick<ICreateInvitationParams, 'principalType'>) => {
  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutateAsync } = useMutation<
    unknown,
    ErrorModel,
    ICreateInvitationParams,
    unknown
  >((params) => createInvitation({ principalType, ...params }), {
    onSuccess: () => {
      // 초대 리스트 다시 가져오기
      queryClient.refetchQueries(ROLES_QUERY_KEYS.INVITATION_LIST, { active: true });
    },
  });

  return {
    invitationsError: error,
    isInvitationsError: isError,
    isInvitationsLoading: isLoading,
    isInvitationsSuccess: isSuccess,
    onInvitations: mutateAsync,
  };
};
