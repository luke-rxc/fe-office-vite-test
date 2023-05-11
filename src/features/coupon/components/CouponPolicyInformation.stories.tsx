import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { AllowType, AllowItemType } from '../constants';
import { CouponFormField, AllowAllInfo, PolicyInfo, CouponAllowItem } from '../types';
import { CouponPolicyInformation } from './CouponPolicyInformation';

export default {
  title: 'Features/Coupon/CouponPolicyInformation',
  component: CouponPolicyInformation,
} as ComponentMeta<typeof CouponPolicyInformation>;

const Template: ComponentStory<typeof CouponPolicyInformation> = (args) => {
  const { watch } = useForm<CouponFormField>({ defaultValues: { usePolicyRequest: { isAllowAll: 'CASE' } } });
  const isAllowAll = watch('usePolicyRequest.isAllowAll') as AllowType;

  const allowAllInfo: AllowAllInfo = {
    isAllowAll,
    handleUpdateAllowAll: (allowType: AllowType) => {
      window.console.log(allowType);
    },
  };

  const policyInfo: PolicyInfo = {
    allowCategories: [
      { id: 1, text: '카테고리1' },
      { id: 2, text: '카테고리2' },
    ],
    allowProviders: [],
    allowGoods: [],
    allowBrands: [],
    denyGoods: [],
    handleUpdateAllowItem: (type: AllowItemType, items: Array<CouponAllowItem>) => {
      window.console.log('update', type, items);
    },
    handleRemoteAllowItem: (type: AllowItemType, id: number) => {
      window.console.log('remove', type, id);
    },
    handleRemoveAllAllowItem: () => {
      window.console.log('removeAll');
    },
    handleUpdateAllAllowItem: () => {
      window.console.log('updateAll');
    },
  };

  return <CouponPolicyInformation {...args} allowAllInfo={allowAllInfo} policyInfo={policyInfo} />;
};

export const Default = Template.bind({});
Default.args = {};
