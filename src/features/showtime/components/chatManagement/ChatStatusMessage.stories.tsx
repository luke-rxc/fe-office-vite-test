import { SendBirdMessageType } from '@features/showtime/models';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ChatStatusMessage } from './ChatStatusMessage';

export default {
  title: 'Features/Showtime/ChatManagement/ChatStatusMessage',
  component: ChatStatusMessage,
} as ComponentMeta<typeof ChatStatusMessage>;

const Template: ComponentStory<typeof ChatStatusMessage> = (args) => {
  const chatItems: Array<SendBirdMessageType> = [];

  return <ChatStatusMessage {...args} items={chatItems} />;
};

export const Default = Template.bind({});
Default.args = {};
