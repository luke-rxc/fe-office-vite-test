import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatUserManagement } from './ChatUserManagement';

export default {
  title: 'Features/Showtime/chatManagement/ChatUserManagement',
  component: ChatUserManagement,
} as ComponentMeta<typeof ChatUserManagement>;

const Template: ComponentStory<typeof ChatUserManagement> = (args) => {
  const muteItems = [];
  const banItems = [];
  return <ChatUserManagement {...args} muteItems={muteItems} banItems={banItems} />;
};

export const Default = Template.bind({});
Default.args = {};
