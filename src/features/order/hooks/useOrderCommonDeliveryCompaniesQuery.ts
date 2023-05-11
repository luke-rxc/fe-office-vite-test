import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback } from 'react';
import { UseQueryOptions } from 'react-query';
import { getDeliveryCompaniesComboList } from '../apis';
import { OrderCommonQueryKeys } from '../constants';
import { ComboDeliveryCompanyModel, toComboDeliveryCompanyListModel } from '../models';
import { DeliveryCompaniesComboItem } from '../schemas';

/**
 * 주문 공통 배송사 코드 조회 query
 */
export const useOrderCommonDeliveryCompaniesQuery = (
  option: UseQueryOptions<Array<DeliveryCompaniesComboItem>, ErrorModel, Array<ComboDeliveryCompanyModel>> = {},
) => {
  const queryFn = useCallback(() => {
    return getDeliveryCompaniesComboList();
  }, []);

  return useQuery(OrderCommonQueryKeys.deliveryCompaniesList(), queryFn, {
    select: (data) => {
      return toComboDeliveryCompanyListModel(data);
    },
    onError: (error: ErrorModel) => window.console.log(error?.data?.message),
    ...option,
  });
};
