import { useContext } from 'react';
import { SiteTypeContext } from '@contexts/SiteTypeContext';

export const useSiteType = () => {
  return useContext(SiteTypeContext);
};
