import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { AuctionRequestStatus } from '../constants';
import { toShowtimeManageItemAuctionGoodsModelList } from '../models';
import { showtimeItemAuctionGoodsSchemaMock } from '../__mocks__/showtimeItemAuctionGoodsSchemaMock';
import { ShowtimeManageAuctionControl } from './ShowtimeManageAuctionControl';

export default {
  title: 'Features/Showtime/ShowtimeManageAuctionControl',
  component: ShowtimeManageAuctionControl,
} as ComponentMeta<typeof ShowtimeManageAuctionControl>;

const Template: ComponentStory<typeof ShowtimeManageAuctionControl> = (args) => {
  const items = toShowtimeManageItemAuctionGoodsModelList(showtimeItemAuctionGoodsSchemaMock);
  const form = useForm({ defaultValues: { unitPrice: '' } });

  const actionInfos: Array<[AuctionRequestStatus, boolean]> = [
    [AuctionRequestStatus.OPENING, true],
    [AuctionRequestStatus.COUNTDOWN, true],
    [AuctionRequestStatus.START_BIDDING, true],
    [AuctionRequestStatus.SUCCESSFUL_BID, true],
  ];

  return (
    <FormProvider {...form}>
      <ShowtimeManageAuctionControl {...args} auctionGoods={items[0]} actionInfos={actionInfos} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
