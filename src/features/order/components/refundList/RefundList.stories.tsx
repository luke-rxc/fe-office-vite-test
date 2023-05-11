import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RefundList } from './RefundList';

export default {
  title: 'Features/Order/Refund/RefundList',
  component: RefundList,
} as ComponentMeta<typeof RefundList>;

const Template: ComponentStory<typeof RefundList> = (args) => {
  return <RefundList {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  items: [],
  isLoading: false,
};
