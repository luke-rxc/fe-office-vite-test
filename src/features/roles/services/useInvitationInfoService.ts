import { useQuery } from '@hooks/useQuery';
import { ROLES_QUERY_KEYS } from '../constants';
import { getInvitationInfo, IGetInvitationInfoParams } from '../apis';
import { toInvitationInfoModel } from '../models';
import { useProviderComboListService } from './useProviderComboListService';

/**
 * 초대 정보 상세
 */
export const useInvitationInfoService = ({ inviteId, principalType }: IGetInvitationInfoParams) => {
  const { data, error, isError, isSuccess, isFetched, isLoading } = useQuery(
    [ROLES_QUERY_KEYS.INVITATION_INFO, inviteId],
    () => getInvitationInfo({ inviteId, principalType }),
  );

  const {
    providerComboList,
    providerComboListError,
    isProviderComboListError,
    isProviderComboListSuccess,
    isProviderComboListFetched,
    isProviderComboListLoading,
  } = useProviderComboListService();

  return {
    invitationInfo: { ...toInvitationInfoModel(data), providerComboList },
    InvitationInfoError: error || providerComboListError,
    isInvitationInfoError: isError || isProviderComboListError,
    isInvitationInfoLoading: isLoading || isProviderComboListLoading,
    isInvitationInfoSuccess: isSuccess && isProviderComboListSuccess,
    isInvitationInfoFetched: isFetched && isProviderComboListFetched,
  };
};
