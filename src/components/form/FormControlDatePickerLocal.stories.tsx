import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toDateFormat } from '@utils/date';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlDatePickerLocal } from './FormControlDatePickerLocal';

export default {
  title: 'Components/Form/FormControlDatePickerLocal',
  component: FormControlDatePickerLocal,
} as ComponentMeta<typeof FormControlDatePickerLocal>;

interface FormField {
  date: string;
}

const Template: ComponentStory<typeof FormControlDatePickerLocal> = (args) => {
  const formMethod = useForm<FormField>({
    defaultValues: {
      date: toDateFormat(new Date()),
    },
  });
  const { handleSubmit } = formMethod;

  const handleFormSubmit = handleSubmit((values: FormField) => {
    window.console.log('values', values);
  });

  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleFormSubmit}>
        <FormControlDatePickerLocal<FormField> name="date" />
        <Box p="5px 0" />
        <Button type="submit" variant="contained">
          SUBMIT
        </Button>
      </form>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
