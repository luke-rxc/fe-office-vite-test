import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrderRetrieval } from './OrderRetrieval';

export default {
  title: 'Features/Order/ReturnDetail/OrderRetrieval',
  component: OrderRetrieval,
} as ComponentMeta<typeof OrderRetrieval>;

const Template: ComponentStory<typeof OrderRetrieval> = (args) => {
  const formMethod = useForm();
  return (
    <FormProvider {...formMethod}>
      <OrderRetrieval {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
