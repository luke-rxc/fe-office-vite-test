import { ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ReturnSearchForm } from './ReturnSearchForm';

export default {
  title: 'Features/Order/Return/ReturnSearchForm',
  component: ReturnSearchForm,
} as ComponentMeta<typeof ReturnSearchForm>;

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
      <ReturnSearchForm {...args} form={form} />
    </FormProvider>
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
