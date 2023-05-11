import { ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrderSearchForm } from './OrderSearchForm';

export default {
  title: 'Features/Order/Order/OrderSearchForm',
  component: OrderSearchForm,
} as ComponentMeta<typeof OrderSearchForm>;

const Template = (args) => {
  const formMethod = useForm();
  const form = {
    formMethod,
    handleSubmit: formMethod.handleSubmit((values) => {
      window.console.log(values);
    }),
    handleReset: () => {},
  };
  return (
    <FormProvider {...formMethod}>
      <OrderSearchForm {...args} form={form} />
    </FormProvider>
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
