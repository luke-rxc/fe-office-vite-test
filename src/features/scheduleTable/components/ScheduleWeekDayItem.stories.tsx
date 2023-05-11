import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toScheduleTableWeekDaysModel } from '../models';
import { getWeekDates } from '../utils';
import { scheduleTableItemSchemaListMock } from '../__mocks__/scheduleTableSchemaMock';
import { ScheduleWeekDayItem } from './ScheduleWeekDayItem';

export default {
  title: 'Features/ScheduleTable/ScheduleWeekDayItem',
  component: ScheduleWeekDayItem,
} as ComponentMeta<typeof ScheduleWeekDayItem>;

const Template: ComponentStory<typeof ScheduleWeekDayItem> = (args) => {
  const weekDays = getWeekDates(0);
  const scheduleItem = toScheduleTableWeekDaysModel(scheduleTableItemSchemaListMock, weekDays)[3];
  return <ScheduleWeekDayItem {...args} scheduleItem={scheduleItem} />;
};

export const Default = Template.bind({});
Default.args = {};
