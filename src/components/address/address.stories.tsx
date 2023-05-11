import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Address } from './Address';

export default {
  title: 'Components/Address',
  component: Address,
} as ComponentMeta<typeof Address>;

const Template: ComponentStory<typeof Address> = (args) => <Address {...args} />;
export const Default = Template.bind({});
Default.args = {};

export const Active = Template.bind({});
Active.args = {
  postCode: '42957',
  address: '대구 달성군 화원읍 류목정길 5',
  addressDetail: '1길',
};

export const Error = Template.bind({});
Error.args = {
  postCode: '42957',
  address: '대구 달성군 화원읍 류목정길 5',
  error: {
    postCode: false,
    address: false,
    addressDetail: true,
  },
};
