import { useMemo } from 'react';
import { useSiteType } from '@hooks/useSiteType';
import { SiteType } from '@constants/site';

export const useUserType = () => {
  const userType = useSiteType();
  const { isPartner, isManager } = useMemo(
    () => ({
      isPartner: userType === SiteType.PARTNER,
      isManager: userType === SiteType.MANAGER,
    }),
    [userType],
  );

  return {
    userType,
    isPartner,
    isManager,
  };
};
