import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderGoodsInfo } from './OrderGoodsInfo';

export default {
  title: 'Components/Order/OrderGoodsInfo',
  component: OrderGoodsInfo,
} as ComponentMeta<typeof OrderGoodsInfo>;

const Template: ComponentStory<typeof OrderGoodsInfo> = (args) => {
  return <OrderGoodsInfo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      id: 0,
      goods: {
        name: '나이키 남성용 REV5',
        price: '2,000',
        stock: '30/12',
        primaryImage: 'https://cdn-dev.prizm.co.kr/goods/20211122/c7c0f1b2-7778-48b6-816f-5dd6809d0590.png',
      },
      ea: 1,
      step20Ea: 0,
      step30Ea: 3,
      step40Ea: 0,
      step50Ea: 0,
      step60Ea: 0,
      step70Ea: 0,
      refundEa: 0,
      status: {
        step: '상품준비',
      },
      shipping: {
        cost: '2500',
      },
      rowSpan: 2,
    },
    {
      id: 1,
      goods: {
        name: '나이키 남성용 REV5',
        price: '2,000',
        stock: '30/12',
        primaryImage: 'https://cdn-dev.prizm.co.kr/goods/20211122/c7c0f1b2-7778-48b6-816f-5dd6809d0590.png',
      },
      ea: 1,
      step20Ea: 0,
      step30Ea: 3,
      step40Ea: 0,
      step50Ea: 0,
      step60Ea: 0,
      step70Ea: 0,
      refundEa: 0,
      status: {
        step: '상품준비',
      },
      shipping: {
        cost: '2500',
      },
    },
  ],
};
