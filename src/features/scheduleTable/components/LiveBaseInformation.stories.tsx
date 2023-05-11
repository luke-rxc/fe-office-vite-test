import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toScheduleTableDetailItemModel } from '../models';
import { scheduleTableDetailItemSchemaMock } from '../__mocks__/scheduleTableDetailItemSchemaMock';
import { LiveBaseInformation } from './LiveBaseInformation';

export default {
  title: 'Features/ScheduleTable/LiveBaseInformation',
  component: LiveBaseInformation,
} as ComponentMeta<typeof LiveBaseInformation>;

const Template: ComponentStory<typeof LiveBaseInformation> = (args) => {
  const item = toScheduleTableDetailItemModel(scheduleTableDetailItemSchemaMock);
  return <LiveBaseInformation item={item} {...args} />;
};

export const Default = Template.bind({});
Default.args = {};
