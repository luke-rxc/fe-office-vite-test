import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toScheduleTableItemsModel } from '../models';
import { scheduleTableItemSchemaListMock } from '../__mocks__/scheduleTableSchemaMock';
import { ScheduleItem } from './ScheduleItem';

export default {
  title: 'Features/ScheduleTable/ScheduleItem',
  component: ScheduleItem,
} as ComponentMeta<typeof ScheduleItem>;

const Template: ComponentStory<typeof ScheduleItem> = (args) => {
  const item = toScheduleTableItemsModel(scheduleTableItemSchemaListMock)[0];
  return <ScheduleItem {...args} item={item} />;
};

export const Default = Template.bind({});
Default.args = {};
