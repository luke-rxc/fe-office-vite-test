import { GoodsListContainer, PartnerGoodsListContainer } from '../containers';
import { useSiteType } from '@hooks/useSiteType';
import { SiteType } from '@constants/site';

const GoodsListPage = () => {
  const currentSiteType = useSiteType();
  const isPartnerSite = currentSiteType === SiteType.PARTNER;

  return <>{isPartnerSite ? <PartnerGoodsListContainer /> : <GoodsListContainer />}</>;
};

export default GoodsListPage;
