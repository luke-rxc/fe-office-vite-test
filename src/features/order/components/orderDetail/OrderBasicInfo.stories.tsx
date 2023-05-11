import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderBasicInfo } from './OrderBasicInfo';

export default {
  title: 'Features/Order/OrderDetail/OrderBasicInfo',
  component: OrderBasicInfo,
} as ComponentMeta<typeof OrderBasicInfo>;

const Template: ComponentStory<typeof OrderBasicInfo> = (args) => {
  return <OrderBasicInfo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  item: {
    orderId: 2112171709321426,
    isRefundable: true,
    isReturnable: false,
    isExchangeable: false,
    orderer: {
      email: 'kai@rxc.co.kr',
      name: 'kai',
      phone: '01041114428',
    },
    recipient: {
      isChangeShippingInfo: true,
      name: '심명섭',
      phone: '01041114428',
      postCode: '06159',
      address: '서울 강남구 테헤란로 427',
      addressDetail: '지하 1층 RXC',
      deliveryRequestMessage: '배송 전 연락 바랍니다.',
      pcccNumber: null,
    },
    payment: {
      paymentType: {
        type: 'CREDIT_CARD',
        name: '신용카드',
        description: '외환카드(5327-****-****-1895) | 일시불',
      },
      amount: 27500,
      totalShippingCost: 2500,
      totalUsedCouponSale: 0,
      usedPoint: 0,
    },
  },
};
