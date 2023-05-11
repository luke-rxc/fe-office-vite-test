import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Transfer } from './Transfer';

export default {
  title: 'Components/Transfer',
  component: Transfer,
} as ComponentMeta<typeof Transfer>;

const Template: ComponentStory<typeof Transfer> = (args) => <Transfer {...args} />;

const dummyLeftList = new Array(5).fill(true).map((item, index) => ({
  value: `leftList-${index}`,
  label: `list item ${index}`,
  readOnly: !index,
}));

const dummyRightList = new Array(5).fill(true).map((item, index) => ({
  value: `rightList-${index}`,
  label: `list item ${index}`,
}));

export const Default = Template.bind({});
Default.args = {
  leftList: dummyLeftList,
  rightList: dummyRightList,
  onChange: (leftList, rightList) => {
    console.log(leftList, rightList);
  },
};

export const 헤더가_있는_경우 = Template.bind({});
헤더가_있는_경우.args = {
  leftHeader: '제목1',
  leftList: dummyLeftList,
  rightHeader: '제목1',
  rightList: dummyRightList,
};
