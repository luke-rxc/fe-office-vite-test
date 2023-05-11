import { CouponGoods, CouponSummary } from '../components';
import { AllowItemType } from '../constants';
import { useCouponGoodsService } from '../services';
import { PolicyInfo } from '../types';

interface Props {
  type: AllowItemType;
  policyInfo?: PolicyInfo;
}

export const CouponGoodsContainer = (props: Props) => {
  const { form, tableProps, summaryItems, handleAddSelectItem } = useCouponGoodsService(props);
  return (
    <>
      <CouponGoods form={form} tableProps={tableProps} handleAddSelectItem={handleAddSelectItem} />
      <CouponSummary
        title="상품"
        items={summaryItems}
        type={props.type}
        onClickDelete={props.policyInfo?.handleRemoteAllowItem}
      />
    </>
  );
};
