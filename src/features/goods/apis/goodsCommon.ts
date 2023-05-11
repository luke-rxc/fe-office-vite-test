import { baseApiClient } from '@utils/api';
import { ApiDomain } from '../constants';

interface PartnerSaleRequestParams {
  goodsIds: number[];
}

/** 파트너 : 승인 요청 */
export const postPartnerSaleRequest = async ({ goodsIds }: PartnerSaleRequestParams) => {
  const params = { goodsIds };
  return baseApiClient.post(`${ApiDomain.Goods}/sale-request`, params);
};
