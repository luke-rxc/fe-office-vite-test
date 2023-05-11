import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { PolicyTab } from '../constants';
import { CouponPolicy } from './CouponPolicy';

export default {
  title: 'Features/Coupon/CouponPolicy',
  component: CouponPolicy,
} as ComponentMeta<typeof CouponPolicy>;

const Template: ComponentStory<typeof CouponPolicy> = (args) => {
  const [selectedTab, setSelectedTab] = useState<PolicyTab>(PolicyTab.INCLUSION);
  const tabItems = [
    { label: '쿠폰적용', value: PolicyTab.INCLUSION, children: 'Tab 1' },
    { label: '쿠폰제외', value: PolicyTab.EXCLUSION, children: 'Tab 2' },
  ];

  const handelChangeTab = (selectedValue: PolicyTab) => {
    setSelectedTab(selectedValue);
  };

  return <CouponPolicy {...args} tabItems={tabItems} selectedTab={selectedTab} onChangeTab={handelChangeTab} />;
};

export const Default = Template.bind({});
Default.args = {};
