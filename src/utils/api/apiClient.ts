import { apiConfig } from '@config';
import { SiteType } from '@constants/site';
import { getSiteType } from '../getSiteType';
import { createAxios } from './createAxios';

const { apiManagerBaseUrl, apiPartnerBaseUrl } = apiConfig;

export const commonApiClient = createAxios({
  baseURL: getBaseUrl(),
  headers: {
    common: {
      Accept: 'application/json',
    },
  },
  withCredentials: false,
});

export const baseApiClient = createAxios({
  baseURL: getBaseUrl({ useSiteTypeSegment: true }),
  headers: {
    common: {
      Accept: 'application/json',
    },
  },
  withCredentials: false,
});

export const baseApiMultiPartFormClient = createAxios({
  baseURL: getBaseUrl({ useSiteTypeSegment: true }),
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: false,
});

type getBaseUrlOptions = {
  useSiteTypeSegment?: boolean;
};

function getBaseUrl({ useSiteTypeSegment = false }: getBaseUrlOptions = {}) {
  const currentSiteType = getSiteType();
  const baseApiUrl = currentSiteType === SiteType.MANAGER ? apiManagerBaseUrl : apiPartnerBaseUrl;

  return useSiteTypeSegment ? baseApiUrl.concat('/', currentSiteType.toLowerCase()) : baseApiUrl;
}
