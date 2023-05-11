import { Modal } from '@components/Modal';
import { CouponTabs } from '../components';
import { CouponPolicyServiceReturn, useCouponPolicyItemService, useCouponPolicyModalService } from '../services';
import { PolicyInfo, AllowAllInfo } from '../types';

interface Props {
  layoutInfo: CouponPolicyServiceReturn;
  policyInfo: PolicyInfo;
  allowAllInfo: AllowAllInfo;
}

export const CouponPolicyModalContainer = (props: Props) => {
  const {
    layoutInfo: { modalOpen },
  } = props;

  const { policyInfo: tempPolicyInfo } = useCouponPolicyItemService(props.policyInfo);

  const {
    tabItems,
    selectedTab,
    disabledConfirmCouponPolicy,
    handleChangeTab,
    handleCancelCouponPolicy,
    handleConfirmCouponPolicy,
  } = useCouponPolicyModalService({ ...props, tempPolicyInfo });

  return (
    <Modal
      open={modalOpen}
      onCancel={handleCancelCouponPolicy}
      onConfirm={handleConfirmCouponPolicy}
      title="쿠폰 적용 대상"
      minWidth="100%"
      minHeight="90%"
      disabled={disabledConfirmCouponPolicy}
    >
      <CouponTabs tabName="coupon-policy" tabItems={tabItems} selectedTab={selectedTab} onChangeTab={handleChangeTab} />
    </Modal>
  );
};
