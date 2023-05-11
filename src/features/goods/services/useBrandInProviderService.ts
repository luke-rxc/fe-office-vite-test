import { useQuery } from '@hooks/useQuery';
import { useSiteType } from '@hooks/useSiteType';
import { SiteType } from '@constants/site';
import { getBrandInProviderList } from '../apis';
import { toBrandList } from '../models';
import { BrandListSchema } from '../schemas';
import { QueryKey } from '../constants';

interface Props {
  providerId: number;
}

export const useBrandInProviderService = ({ providerId }: Props) => {
  const currentSiteType = useSiteType();
  const isPartnerSite = currentSiteType === SiteType.PARTNER;
  const paramProviderId = !isPartnerSite ? providerId : null;
  const {
    data: brandLists,
    isLoading: isBrandListLoading,
    isError: isBrandListError,
  } = useQuery(
    [QueryKey.BrandList, providerId],
    async () => {
      const res = await getBrandInProviderList(paramProviderId);
      return res;
    },
    {
      select: (data: BrandListSchema) => {
        return toBrandList(data?.items);
      },
      enabled: !!providerId,
    },
  );

  return {
    brandLists: brandLists ?? [],
    isBrandListLoading,
    isBrandListError,
  };
};
