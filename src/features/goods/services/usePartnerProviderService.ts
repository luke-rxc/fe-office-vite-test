import { useCallback } from 'react';
import { useSiteType } from '@hooks/useSiteType';
import useAuth from '@hooks/useAuth';
import { SiteType } from '@constants/site';

interface ProviderInfoReturnProps {
  id: number;
  name: string;
  commissionRate: number;
}

export const usePartnerProviderService = () => {
  const currentSiteType = useSiteType();
  const authInfo = useAuth();
  const getProviderInfo = useCallback((): ProviderInfoReturnProps | null => {
    if (currentSiteType === SiteType.MANAGER) {
      return null;
    }

    return authInfo.user?.provider ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSiteType]);

  return {
    providerInfo: getProviderInfo(),
  };
};
