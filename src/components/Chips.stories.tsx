import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Chips } from './Chips';

export default {
  title: 'Components/Chips',
  component: Chips,
} as ComponentMeta<typeof Chips>;

const Template: ComponentStory<typeof Chips> = (args) => <Chips {...args} />;

export const 아이템_노출 = Template.bind({});
아이템_노출.args = {
  items: [
    {
      title: 'test1',
    },
    {
      title: 'test2',
    },
  ],
  getLabel: ({ title }) => title,
};
export const empty = Template.bind({});
empty.args = {
  items: [],
  emptyText: '선택된 상품이 없습니다',
  getLabel: ({ title }) => title,
};
