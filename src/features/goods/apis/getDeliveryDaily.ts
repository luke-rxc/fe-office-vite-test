import { baseApiClient } from '@utils/api';
import { DetailDeliveryDailySchema } from '../schemas';
import { ApiDomain } from '../constants';
// import { DetailDeliveryDailySchemaMocks } from '../__mocks__/detailDeliveryDailySchemaMocks';

export const getDeliveryDaily = (): Promise<DetailDeliveryDailySchema> => {
  // return Promise.resolve<DetailDeliveryDailySchema>(DetailDeliveryDailySchemaMocks);
  return baseApiClient.get<DetailDeliveryDailySchema>(`${ApiDomain.Goods}/deliveryendtimes`);
};
