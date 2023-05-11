import { useQuery } from '@hooks/useQuery';
import { ROLES_QUERY_KEYS } from '../constants';
import { getInvitationList, IGetInvitationInfoParams } from '../apis';
import { toInvitationListModel } from '../models';

/**
 * 초대 현황 목록 조회
 */
export const useInvitationListService = ({ principalType }: Pick<IGetInvitationInfoParams, 'principalType'>) => {
  const {
    data = [],
    error,
    isError,
    isFetched,
    isLoading,
  } = useQuery([ROLES_QUERY_KEYS.INVITATION_LIST, principalType], () => {
    return getInvitationList({ principalType });
  });

  return {
    invitationList: toInvitationListModel(data),
    invitationListError: error,
    isInvitationListError: isError,
    isInvitationListFetched: isFetched,
    isInvitationListLoading: isLoading,
  };
};
