import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AuctionGoodsSummary } from './AuctionGoodsSummary';

export default {
  title: 'Features/Showtime/AuctionGoodsSummary',
  component: AuctionGoodsSummary,
} as ComponentMeta<typeof AuctionGoodsSummary>;

const Template: ComponentStory<typeof AuctionGoodsSummary> = (args) => {
  return <AuctionGoodsSummary {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: '선택된 상품',
  items: [
    {
      name: '나이키 양말셋트(10pcs)',
      startPrice: 10000,
      startPriceText: '10,000 원',
      bidUnitPrice: 1000,
      bidUnitPriceText: '1,000 원',
      primaryImageId: 0,
      primaryImagePath: 'https://cdn-dev.prizm.co.kr/goods/20210701/09316356-ba34-4d8f-9295-4b90826dfae7',
      goodsFileIds: [],
      description: '',
      displayStartDate: 11231230,
    },
  ],
};
