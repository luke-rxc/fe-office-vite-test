import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CouponSummary } from './CouponSummary';

export default {
  title: 'Features/Coupon/CouponSummary',
  component: CouponSummary,
} as ComponentMeta<typeof CouponSummary>;

const Template: ComponentStory<typeof CouponSummary> = (args) => {
  return <CouponSummary {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: '쿠폰적용 입점사',
  items: [
    {
      id: 'missa',
      text: '미샤',
      onClickDelete: (id: string) => {
        window.console.log('id', id);
      },
    },
    {
      id: 'innisfree',
      text: '이니스프리',
      onClickDelete: (id: string) => {
        window.console.log('id', id);
      },
    },
  ],
};
