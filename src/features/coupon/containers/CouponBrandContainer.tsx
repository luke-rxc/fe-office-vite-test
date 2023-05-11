import { CouponBrands, CouponSummary } from '../components';
import { AllowItemType } from '../constants';
import { useCouponBrandService } from '../services';
import { PolicyInfo } from '../types';

interface Props {
  type: AllowItemType;
  policyInfo?: PolicyInfo;
}

export const CouponBrandContainer = (props: Props) => {
  const { form, brandList, summaryItems, getOptionDisabled } = useCouponBrandService(props);
  return (
    <>
      <CouponBrands form={form} brandList={brandList} getOptionDisabled={getOptionDisabled} />
      <CouponSummary
        title="브랜드"
        items={summaryItems}
        type={props.type}
        onClickDelete={props.policyInfo?.handleRemoteAllowItem}
      />
    </>
  );
};
