import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderRefundInfo } from './OrderRefundInfo';

export default {
  title: 'Components/Order/OrderRefundInfo',
  component: OrderRefundInfo,
} as ComponentMeta<typeof OrderRefundInfo>;

const Template: ComponentStory<typeof OrderRefundInfo> = (args) => {
  return <OrderRefundInfo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      id: 0,
      createdDate: '2021-12-01',
      goods: {
        name: '나이키 남성용 REV5',
      },
      ea: 1,
      type: '반품환불',
      refundMethod: '수동환불',
      refundPrice: '2,000',
      actorName: '홍길동',
      status: {
        code: '환불완료',
      },
      completeDate: '2021-12-01',
    },
  ],
};
