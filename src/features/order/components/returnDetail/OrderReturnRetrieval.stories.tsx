import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { OrderReturnRetrieval } from './OrderReturnRetrieval';

export default {
  title: 'Features/Order/OrderReturnRetrieval',
  component: OrderReturnRetrieval,
} as ComponentMeta<typeof OrderReturnRetrieval>;

const Template: ComponentStory<typeof OrderReturnRetrieval> = (args) => {
  const formMethod = useForm();
  return (
    <FormProvider {...formMethod}>
      <OrderReturnRetrieval {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  isAutoReturnable: true,
};
