import { ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ExportTicketSearchForm } from './ExportTicketSearchForm';

export default {
  title: 'Features/Order/ExportTicket/ExportTicketSearchForm',
  component: ExportTicketSearchForm,
} as ComponentMeta<typeof ExportTicketSearchForm>;

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
      <ExportTicketSearchForm {...args} form={form} />
    </FormProvider>
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
