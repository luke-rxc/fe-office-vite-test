import { useQuery } from '@hooks/useQuery';
import { useForm } from 'react-hook-form';
import { getBrands } from '../apis';
import { AllowItemType, brandListQueryKey } from '../constants';
import { BrandComboModel, toBrandComboList } from '../models';
import { BrandFormField, PolicyInfo } from '../types';

interface Props {
  policyInfo?: PolicyInfo;
}

/**
 * useCouponBrandService
 * 쿠폰 브랜드 관련 service
 */
export const useCouponBrandService = ({ policyInfo }: Props) => {
  const categoryInitialData: BrandFormField = {
    brand: null,
  };

  const formMethod = useForm<BrandFormField>({
    defaultValues: categoryInitialData,
  });
  const { handleSubmit, setValue } = formMethod;

  const { data: brandList } = useQuery(brandListQueryKey, () => getBrands(), {
    select: (data) => {
      return toBrandComboList(data.items);
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (policyInfo.allowBrands.findIndex((brand) => brand.id === Number(values.brand.value)) > -1) {
      return;
    }

    policyInfo.handleUpdateAllowItem(AllowItemType.ALLOW_BRAND, [
      ...policyInfo.allowBrands,
      { id: Number(values.brand.value), text: values.brand.label },
    ]);

    setValue('brand', null);
  });

  /**
   * 옵션 disabled 처리
   */
  const getOptionDisabled = (option: BrandComboModel) => {
    return policyInfo.allowBrands.findIndex((item) => item.id === Number(option.value)) > -1;
  };

  return {
    form: { formMethod, handleSubmit: onSubmit },
    brandList: brandList ?? [],
    summaryItems: policyInfo.allowBrands,
    getOptionDisabled,
  };
};
