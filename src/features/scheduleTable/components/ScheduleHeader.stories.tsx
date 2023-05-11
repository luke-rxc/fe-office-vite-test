import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useWeekNumber } from '../hooks';
import { ScheduleHeader } from './ScheduleHeader';

export default {
  title: 'Features/ScheduleTable/ScheduleHeader',
  component: ScheduleHeader,
} as ComponentMeta<typeof ScheduleHeader>;

const Template: ComponentStory<typeof ScheduleHeader> = (args) => {
  const { weekTitle, actions } = useWeekNumber();

  return <ScheduleHeader {...args} title={weekTitle} actions={actions} />;
};

export const Default = Template.bind({});
Default.args = {};
