import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderReturnInfo } from './OrderReturnInfo';

export default {
  title: 'Components/Order/OrderReturnInfo',
  component: OrderReturnInfo,
} as ComponentMeta<typeof OrderReturnInfo>;

const Template: ComponentStory<typeof OrderReturnInfo> = (args) => {
  return <OrderReturnInfo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      id: 0,
      createdDate: '2021-12-01',
      goods: {
        name: '나이키 남성용 REV5',
      },
      ea: 1,
      type: '반품/교환',
      actorName: '홍길동',
      status: {
        name: '회수요청',
      },
      refundStatus: '반품요청중',
      completeDate: '2021-12-01',
    },
  ],
};
