import { ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ExportSearchForm } from './ExportSearchForm';

export default {
  title: 'Features/Order/Export/ExportSearchForm',
  component: ExportSearchForm,
} as ComponentMeta<typeof ExportSearchForm>;

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
      <ExportSearchForm {...args} form={form} />
    </FormProvider>
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
