import React, { createContext } from 'react';
import { useSiteType } from '@hooks/useSiteType';
import { SiteType } from '@constants/site';
import { PageType } from '../constants';
import { useParams } from 'react-router-dom';

interface PageTypeProps {
  type: PageType;
  id?: number;
  isPartnerSite: boolean;
}

export const PageTypeContext = createContext<PageTypeProps>({ type: PageType.CREATE, isPartnerSite: false });

export const PageTypeProvider: React.FC = ({ children }) => {
  const { goodsId } = useParams();
  const currentSiteType = useSiteType();
  const type = goodsId ? PageType.MODIFY : PageType.CREATE;
  const id = goodsId ? +goodsId : null;
  const isPartnerSite = currentSiteType === SiteType.PARTNER;

  return <PageTypeContext.Provider value={{ type, id, isPartnerSite }}>{children}</PageTypeContext.Provider>;
};
