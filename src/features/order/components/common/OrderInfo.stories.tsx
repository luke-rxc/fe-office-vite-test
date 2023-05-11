import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderInfo } from './OrderInfo';

export default {
  title: 'Components/Order/OrderInfo',
  component: OrderInfo,
} as ComponentMeta<typeof OrderInfo>;

const Template: ComponentStory<typeof OrderInfo> = (args) => {
  return <OrderInfo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  item: {
    amount: '1,000',
    createdDate: '2021-12-01',
    goodsName: '빈상품',
    orderId: 0,
    orderStatus: '결제확인',
    ordererName: 'tester',
    paymentDate: '2021-12-01',
    paymentType: '카드',
    quantity: '1',
    recipientName: 'tester',
  },
};
