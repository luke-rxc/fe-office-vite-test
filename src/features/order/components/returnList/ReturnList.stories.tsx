import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReturnList } from './ReturnList';

export default {
  title: 'Features/Order/Return/ReturnList',
  component: ReturnList,
} as ComponentMeta<typeof ReturnList>;

const Template: ComponentStory<typeof ReturnList> = (args) => {
  return <ReturnList {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  items: [],
  isLoading: false,
};
