import { ComponentMeta } from '@storybook/react';
import { toShowtimeContentsItemModel } from '../models';
import { showtimeContentsItemSchemaMock } from '../__mocks__/showtimeContentsItemSchemaMock';
import { ShowtimeManageContentsInfo } from './ShowtimeManageContentsInfo';

export default {
  title: 'Features/Showtime/ShowtimeManageContentsInfo',
  component: ShowtimeManageContentsInfo,
} as ComponentMeta<typeof ShowtimeManageContentsInfo>;

const Template = (args) => {
  const item = toShowtimeContentsItemModel(showtimeContentsItemSchemaMock);
  return <ShowtimeManageContentsInfo {...args} item={item} />;
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
