import { Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { OrderList } from './OrderList';

export default {
  title: 'Features/Order/Order/OrderList',
  component: OrderList,
} as ComponentMeta<typeof OrderList>;

const Template: ComponentStory<typeof OrderList> = (args) => {
  return <OrderList {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  actions: (
    <>
      <Button variant="contained" size="small" sx={{ marginLeft: '10px' }}>
        상품준비
      </Button>
      <Button variant="contained" size="small" sx={{ marginLeft: '10px' }}>
        엑셀다운로드
      </Button>
      <Button variant="contained" size="small" sx={{ marginLeft: '10px' }}>
        출고일괄
      </Button>
    </>
  ),
  items: [],
  isLoading: false,
};
