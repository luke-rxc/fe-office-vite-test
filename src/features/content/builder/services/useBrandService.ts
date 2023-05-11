import { useQuery } from '@hooks/useQuery';
import { QUERY_KEY } from '../constants';
import { toComboListModel } from '../models';
import { getBrandCombo } from '../apis';

/**
 * 브랜드 콤보리스트 service
 */
export const useBrandService = () => {
  const { data: brandComboList, isLoading: isLoadingBrandComboList } = useQuery(
    [QUERY_KEY.BRAND_COMBO],
    getBrandCombo,
    {
      select: (data) => {
        return toComboListModel(data.items);
      },
    },
  );

  return {
    brandComboList,
    isLoadingBrandComboList,
  };
};
