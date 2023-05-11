import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Messages } from './Messages';

export default {
  title: 'Features/Order/Messages',
  component: Messages,
} as ComponentMeta<typeof Messages>;

const Template: ComponentStory<typeof Messages> = (args) => {
  const messages = new Array(20).fill(true).map((_, index) => {
    return {
      id: index,
      date: '2021-12-25 10:00:00',
      message: `message ${index + 1}`,
    };
  });

  return <Messages {...args} items={messages} height="300px" />;
};

export const Default = Template.bind({});
Default.args = {};
