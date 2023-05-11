import { useQuery } from '@hooks/useQuery';
import { useSiteType } from '@hooks/useSiteType';
import { SiteType } from '@constants/site';
import { getDeliveryTmpl } from '../../apis';
import { QueryKey } from '../../constants';
import { toProviderDeliveryTmpl } from '../../models';
import { DetailDeliveryTmplSchema } from '../../schemas';

interface Props {
  providerId: number;
}

export const useDeliveryTmplService = ({ providerId }: Props) => {
  const currentSiteType = useSiteType();
  const isPartnerSite = currentSiteType === SiteType.PARTNER;

  /** @todo useQuery Generic */
  const { data: deliveryTmplLists } = useQuery(
    [QueryKey.Detail.DeliveryTime, providerId],
    async () => {
      const res: DetailDeliveryTmplSchema = await getDeliveryTmpl(providerId, isPartnerSite);
      return res;
    },
    {
      select: (data) => toProviderDeliveryTmpl(data.providerShippings),
      enabled: !!providerId,
      cacheTime: 0,
    },
  );

  return {
    deliveryTmplLists: deliveryTmplLists || [],
  };
};
