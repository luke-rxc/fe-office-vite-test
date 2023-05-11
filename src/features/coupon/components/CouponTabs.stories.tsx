import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { AllowType, PolicyTab, CouponInclusionTargetTab } from '../constants';
import { CouponInclusion } from './CouponInclusion';
import { CouponTabs } from './CouponTabs';

export default {
  title: 'Features/Coupon/CouponTabs',
  component: CouponTabs,
} as ComponentMeta<typeof CouponTabs>;

const Template: ComponentStory<typeof CouponTabs> = (args) => {
  const [isAllowAll, setIsAllowAll] = useState<AllowType>(AllowType.ALL);
  const [selectedTab, setSelectedTab] = useState<PolicyTab>(PolicyTab.INCLUSION);
  const [selectedInclusionTab, setSelectedInclusionTab] = useState<CouponInclusionTargetTab>(
    CouponInclusionTargetTab.CATEGORY,
  );

  const inclusionTabItems = [
    { label: '카테고리', value: CouponInclusionTargetTab.CATEGORY, children: '카테고리' },
    { label: '입점사', value: CouponInclusionTargetTab.PROVIDER, children: '입점사' },
    { label: '상품', value: CouponInclusionTargetTab.GOODS, children: '상품' },
  ];

  const handleChangeInclusionTab = (selectTabValue: string) => {
    setSelectedInclusionTab(selectTabValue as CouponInclusionTargetTab);
  };

  const handleChangeAllowAll = (value: AllowType) => {
    setIsAllowAll(value);
  };

  const tabItems = [
    {
      label: '쿠폰적용',
      value: PolicyTab.INCLUSION,
      children: (
        <CouponInclusion
          isAllowAll={isAllowAll}
          onChangeAllowAll={handleChangeAllowAll}
          selectedInclusionTab={selectedInclusionTab}
          inclusionTabItems={inclusionTabItems}
          onChangeTab={handleChangeInclusionTab}
        />
      ),
    },
    { label: '쿠폰제외', value: PolicyTab.EXCLUSION, children: 'Tab 2' },
  ];

  const handleChangeTab = (selectTabValue: string) => {
    setSelectedTab(selectTabValue as PolicyTab);
  };

  return (
    <CouponTabs
      {...args}
      tabName="vertical"
      tabItems={tabItems}
      selectedTab={selectedTab}
      onChangeTab={handleChangeTab}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  orientation: 'horizontal',
};

export const Vertical = Template.bind({});
Vertical.args = {
  orientation: 'vertical',
};
