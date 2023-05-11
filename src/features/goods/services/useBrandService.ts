import { useQuery } from '@hooks/useQuery';
import { getBrandList } from '../apis';
import { toBrandList } from '../models';
import { BrandListSchema } from '../schemas';
import { QueryKey } from '../constants';

export const useBrandService = () => {
  const {
    data: brandLists,
    isLoading: isBrandListLoading,
    isError: isBrandListError,
  } = useQuery([QueryKey.BrandList], getBrandList, {
    select: (data: BrandListSchema) => {
      return toBrandList(data?.items);
    },
  });

  return {
    brandLists: brandLists ?? [],
    isBrandListLoading,
    isBrandListError,
  };
};
