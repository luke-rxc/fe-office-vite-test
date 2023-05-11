import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BanUserList } from './BanUserList';

export default {
  title: 'Features/Showtime/chatManagement/BanUserList',
  component: BanUserList,
} as ComponentMeta<typeof BanUserList>;

const Template: ComponentStory<typeof BanUserList> = (args) => {
  const banItems = [];

  return <BanUserList {...args} items={banItems} height="200px" />;
};

export const Default = Template.bind({});
Default.args = {};
