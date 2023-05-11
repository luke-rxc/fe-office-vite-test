import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { CouponInclusionTargetTab, AllowType } from '../constants';
import { CouponInclusion } from './CouponInclusion';

export default {
  title: 'Features/Coupon/CouponInclusion',
  component: CouponInclusion,
} as ComponentMeta<typeof CouponInclusion>;

const Template: ComponentStory<typeof CouponInclusion> = (args) => {
  const [selectedTab, setSelectedTab] = useState<CouponInclusionTargetTab>(CouponInclusionTargetTab.CATEGORY);
  const [isAllowAll, setIsAllowAll] = useState<AllowType>(AllowType.ALL);
  const tabItems = [
    { label: '카테고리', value: CouponInclusionTargetTab.CATEGORY, children: '카테고리' },
    { label: '입점사', value: CouponInclusionTargetTab.PROVIDER, children: '입점사' },
    { label: '상품', value: CouponInclusionTargetTab.GOODS, children: '상품' },
  ];

  const handleChangeTab = (selectTabValue: string) => {
    setSelectedTab(selectTabValue as CouponInclusionTargetTab);
  };

  const handleChangeAllowAll = (allowType: AllowType) => {
    setIsAllowAll(allowType);
  };

  return (
    <CouponInclusion
      {...args}
      isAllowAll={isAllowAll}
      selectedInclusionTab={selectedTab}
      inclusionTabItems={tabItems}
      onChangeTab={handleChangeTab}
      onChangeAllowAll={handleChangeAllowAll}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
