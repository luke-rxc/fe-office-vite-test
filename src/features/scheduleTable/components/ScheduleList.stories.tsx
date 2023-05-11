import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toScheduleTableItemsModel } from '../models';
import { scheduleTableItemSchemaListMock } from '../__mocks__/scheduleTableSchemaMock';
import { ScheduleList } from './ScheduleList';

export default {
  title: 'Features/ScheduleTable/ScheduleList',
  component: ScheduleList,
} as ComponentMeta<typeof ScheduleList>;

const Template: ComponentStory<typeof ScheduleList> = (args) => {
  const items = toScheduleTableItemsModel(scheduleTableItemSchemaListMock);
  return <ScheduleList {...args} items={items} />;
};

export const Default = Template.bind({});
Default.args = {};
