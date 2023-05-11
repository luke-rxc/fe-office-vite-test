import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toShowtimeRaffleEventDetailItemModel } from '../models';
import { showtimeRaffleEventDetailItemSchemaMock } from '../__mocks__/showtimeRaffleEventItemSchemaMock';
import { ShowtimeManageRaffleEventWinnerResult } from './ShowtimeManageRaffleEventWinnerResult';

export default {
  title: 'Features/Showtime/ShowtimeManageRaffleEventWinnerResult',
  component: ShowtimeManageRaffleEventWinnerResult,
} as ComponentMeta<typeof ShowtimeManageRaffleEventWinnerResult>;

const Template: ComponentStory<typeof ShowtimeManageRaffleEventWinnerResult> = (args) => {
  const item = toShowtimeRaffleEventDetailItemModel(showtimeRaffleEventDetailItemSchemaMock);
  return <ShowtimeManageRaffleEventWinnerResult {...args} item={item} />;
};

export const Default = Template.bind({});
Default.args = {};
