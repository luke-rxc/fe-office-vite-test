import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrderRequestReturn } from './OrderRequestReturn';

export default {
  title: 'Features/Order/common/OrderRequestReturn',
  component: OrderRequestReturn,
} as ComponentMeta<typeof OrderRequestReturn>;

const Template: ComponentStory<typeof OrderRequestReturn> = (args) => {
  const formMethod = useForm();
  return (
    <FormProvider {...formMethod}>
      <OrderRequestReturn {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  returnReasonItems: [],
};
