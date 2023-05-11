import React from 'react';
import { SiteType } from '@constants/site';
import { getSiteType } from '@utils/getSiteType';

export const SiteTypeContext = React.createContext<SiteType>(SiteType.PARTNER);

/**
 * 도메인에 따라 파트너와 관리자 사이트를 분기한다.
 * @param children
 * @constructor
 */
export const SiteTypeProvider: React.FC = ({ children }) => {
  const [userType] = React.useState<SiteType>(getSiteType());

  return <SiteTypeContext.Provider value={userType}>{children}</SiteTypeContext.Provider>;
};
