import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MuteUserList } from './MuteUserList';

export default {
  title: 'Features/Showtime/chatManagement/MuteUserList',
  component: MuteUserList,
} as ComponentMeta<typeof MuteUserList>;

const Template: ComponentStory<typeof MuteUserList> = (args) => {
  const muteItems = [];

  return <MuteUserList {...args} items={muteItems} height="200px" />;
};

export const Default = Template.bind({});
Default.args = {};
