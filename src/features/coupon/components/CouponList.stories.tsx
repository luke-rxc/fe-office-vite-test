import { ComponentStory, ComponentMeta } from '@storybook/react';
import { couponSchemaMock } from '../__mocks__/couponSchemaMock';
import { CouponList } from './CouponList';
import { toCouponModelList } from '../models';

export default {
  title: 'Features/Coupon/CouponList',
  component: CouponList,
} as ComponentMeta<typeof CouponList>;

const Template: ComponentStory<typeof CouponList> = (args) => {
  const items = toCouponModelList(couponSchemaMock.content);
  return <CouponList {...args} items={items} />;
};

export const Default = Template.bind({});
Default.args = {
  columns: [
    {
      label: '쿠폰번호',
      dataKey: 'id',
    },
    {
      label: '쿠폰명(서비스/관리자)',
      dataKey: 'name',
    },
    {
      label: '쿠폰타입',
      dataKey: 'useTypeText',
    },
    {
      label: '할인혜택',
      dataKey: 'salePolicy.saleInfoText',
    },
    {
      label: '다운로드기간',
      dataKey: 'downloadPolicy.downloadPolicyText',
    },
    {
      label: '사용기간',
      dataKey: 'issuePeriod.useEnabledPeriodText',
    },
    {
      label: '발급/사용내역',
      dataKey: 'issuedStat.statText',
    },
    {
      label: '쿠폰상태',
      dataKey: 'active',
      render: (_, item) => {
        return item.status ? '사용' : '미사용';
      },
    },
  ],
};
