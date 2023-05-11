import { useQuery } from '@hooks/useQuery';
import { DeliveryCompanySchema } from '../schemas';
import { getDeliveryCompany } from '../apis';
import { toDeliveryCompany, SelectTypeModel } from '../models';
import { QUERY_KEYS } from '../constants';

/**
 * 택배사 조회
 * @param {number} id
 */
export const useGetDeliveryCompany = (): {
  deliveryCompanyList: SelectTypeModel[];
} => {
  const { data } = useQuery(QUERY_KEYS.DELIVERY_COMPANY_LIST, () => getDeliveryCompany(), {
    select: (data: DeliveryCompanySchema[]) => toDeliveryCompany(data),
  });

  return {
    deliveryCompanyList: data,
  };
};
