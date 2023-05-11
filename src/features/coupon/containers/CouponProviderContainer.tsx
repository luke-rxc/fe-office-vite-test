import { CouponProvider, CouponSummary } from '../components';
import { AllowItemType } from '../constants';
import { useCouponProviderService } from '../services';
import { PolicyInfo } from '../types';

interface Props {
  policyInfo?: PolicyInfo;
}

export const CouponProviderContainer = (props: Props) => {
  const { form, tableProps, summaryItems, handleAddSelectItem } = useCouponProviderService(props);
  return (
    <>
      <CouponProvider form={form} tableProps={tableProps} onAddSelectItem={handleAddSelectItem} />
      <CouponSummary
        title="추가된 입점사"
        items={summaryItems}
        type={AllowItemType.ALLOW_PROVIDER}
        onClickDelete={props.policyInfo.handleRemoteAllowItem}
      />
    </>
  );
};
