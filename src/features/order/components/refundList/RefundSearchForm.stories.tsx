import { ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { RefundSearchForm } from './RefundSearchForm';

export default {
  title: 'Features/Order/Refund/RefundSearchForm',
  component: RefundSearchForm,
} as ComponentMeta<typeof RefundSearchForm>;

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
      <RefundSearchForm {...args} form={form} />
    </FormProvider>
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
