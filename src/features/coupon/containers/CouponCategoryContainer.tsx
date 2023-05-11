import { CouponCategories, CouponSummary } from '../components';
import { AllowItemType } from '../constants';
import { useCouponCategoryService } from '../services';
import { PolicyInfo } from '../types';

interface Props {
  policyInfo?: PolicyInfo;
}

export const CouponCategoryContainer = (props: Props) => {
  const { form, categoryData, summaryItems } = useCouponCategoryService(props);
  return (
    <>
      <CouponCategories form={form} categoryData={categoryData} />
      <CouponSummary
        type={AllowItemType.ALLOW_CATEGORY}
        title="선택된 카테고리"
        items={summaryItems}
        onClickDelete={props.policyInfo.handleRemoteAllowItem}
      />
    </>
  );
};
