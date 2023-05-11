import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { toShowtimeRaffleEventDetailModel } from '../models';
import { showtimeRaffleEventDetailSchemaMock } from '../__mocks__/showtimeRaffleEventItemSchemaMock';
import { ShowtimeManageRaffleEventList } from './ShowtimeManageRaffleEventList';

export default {
  title: 'Features/Showtime/ShowtimeManageRaffleEventList',
  component: ShowtimeManageRaffleEventList,
} as ComponentMeta<typeof ShowtimeManageRaffleEventList>;

const Template: ComponentStory<typeof ShowtimeManageRaffleEventList> = (args) => {
  const [selectedIds, setSelectedIds] = useState<Array<number>>([]);
  const item = toShowtimeRaffleEventDetailModel(showtimeRaffleEventDetailSchemaMock);

  const onUpdateSelectedIds = (items: Array<number>) => {
    setSelectedIds(items.map((item) => item));
  };

  return (
    <>
      <ShowtimeManageRaffleEventList
        {...args}
        item={item}
        selectedIds={selectedIds}
        onUpdateSelectedIds={onUpdateSelectedIds}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
