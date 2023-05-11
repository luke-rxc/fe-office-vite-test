import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrderDelivery } from './OrderDelivery';

export default {
  title: 'Features/Order/OrderDetail/OrderDelivery',
  component: OrderDelivery,
} as ComponentMeta<typeof OrderDelivery>;

const Template: ComponentStory<typeof OrderDelivery> = (args) => {
  const formMethod = useForm();
  return (
    <FormProvider {...formMethod}>
      <OrderDelivery {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
