import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RefundStatusConfirmMessage } from './RefundStatusConfirmMessage';

export default {
  title: 'Features/Order/RefundDetail/RefundStatusConfirmMessage',
  component: RefundStatusConfirmMessage,
} as ComponentMeta<typeof RefundStatusConfirmMessage>;

const Template: ComponentStory<typeof RefundStatusConfirmMessage> = (args) => {
  return <RefundStatusConfirmMessage {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  refundStatusText: '환불 접수',
  params: {
    refundId: '123',
    refundMethod: 'CREDIT_CARD',
    refundStatus: 'REQUEST',
    refundPrice: '10000',
    refundPoint: '1000',
    refundShippingCostList: [
      {
        providerId: 210,
        refundShippingCost: -1000,
        shippingId: 2426,
      },
    ],
  },
};
