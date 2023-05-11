import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrderRequestRefund } from './OrderRequestRefund';

export default {
  title: 'Features/Order/common/OrderRequestRefund',
  component: OrderRequestRefund,
} as ComponentMeta<typeof OrderRequestRefund>;

const Template: ComponentStory<typeof OrderRequestRefund> = (args) => {
  const formMethod = useForm();
  return (
    <FormProvider {...formMethod}>
      <OrderRequestRefund {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  refundItemOption: { isFullRefundable: true, refundableItemOptionList: [] },
  refundReasonItems: [],
  rowSelection: {
    selectedRowKeys: [],
    onchange: () => {},
    rowSelectionColumnIndex: 2,
  },
  onClickSelectProviderGoodsOption: () => {},
};
