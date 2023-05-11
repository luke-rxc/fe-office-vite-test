import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toScheduleTableWeekDaysModel } from '../models';
import { getWeekDates } from '../utils';
import { scheduleTableItemSchemaListMock } from '../__mocks__/scheduleTableSchemaMock';
import { ScheduleWeekDays } from './ScheduleWeekDays';

export default {
  title: 'Features/ScheduleTable/ScheduleWeekDays',
  component: ScheduleWeekDays,
} as ComponentMeta<typeof ScheduleWeekDays>;

const Template: ComponentStory<typeof ScheduleWeekDays> = (args) => {
  const weekDays = getWeekDates(-1);
  const scheduleItems = toScheduleTableWeekDaysModel(scheduleTableItemSchemaListMock, weekDays);
  return <ScheduleWeekDays {...args} scheduleItems={scheduleItems} />;
};

export const Default = Template.bind({});
Default.args = {};
