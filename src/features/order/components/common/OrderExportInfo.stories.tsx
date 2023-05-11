import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderExportInfo } from './OrderExportInfo';

export default {
  title: 'Components/Order/OrderExportInfo',
  component: OrderExportInfo,
} as ComponentMeta<typeof OrderExportInfo>;

const Template: ComponentStory<typeof OrderExportInfo> = (args) => {
  return <OrderExportInfo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      id: 0,
      exportedDate: '2021-12-01',
      goods: {
        name: '제주 삼다수',
      },
      ea: 1,
      delivery: {
        company: '대한통운',
        number: '123456789',
      },
      inShippingDate: '2021-12-01',
      completeDate: '2021-12-01',
      status: {
        step: '출고완료',
      },
    },
  ],
};
