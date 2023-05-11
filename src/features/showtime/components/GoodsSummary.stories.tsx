import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GoodsSummary } from './GoodsSummary';

export default {
  title: 'Features/Showtime/GoodsSummary',
  component: GoodsSummary,
} as ComponentMeta<typeof GoodsSummary>;

const Template: ComponentStory<typeof GoodsSummary> = (args) => {
  return <GoodsSummary {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: '선택된 상품',
  items: [
    {
      id: 158,
      name: '나이키 양말셋트(10pcs)',
      price: '₩ 7,000',
      consumerPrice: '₩ 10,000',
      onClickDelete: (id: string) => {
        window.console.log('id', id);
      },
    },
    {
      id: 166,
      name: '르까프양말',
      price: '₩ 5,000',
      onClickDelete: (id: string) => {
        window.console.log('id', id);
      },
    },
  ],
};
