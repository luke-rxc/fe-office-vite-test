import { baseApiClient } from '@utils/api';
import { DetailDetailNoticeSchema } from '../schemas';
import { ApiDomain } from '../constants';
// import { DetailDetailNoticeSchemaMocks } from '../__mocks__/detailDetailNoticeSchemaMocks';

export const getNotice = (): Promise<DetailDetailNoticeSchema> => {
  // return Promise.resolve<DetailDetailNoticeSchema>(DetailDetailNoticeSchemaMocks);
  return baseApiClient.get<DetailDetailNoticeSchema>(`${ApiDomain.Goods}/information-notice`);
};
