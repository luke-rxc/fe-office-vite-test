import { SiteType } from '@constants/site';

export function getSiteType(url: string = window.location.origin): SiteType {
  const { hostname } = new URL(url);

  return hostname.includes(SiteType.MANAGER.toLowerCase()) ? SiteType.MANAGER : SiteType.PARTNER;
}
