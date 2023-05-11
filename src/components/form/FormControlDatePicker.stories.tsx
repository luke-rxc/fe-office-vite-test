import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toDateFormat } from '@utils/date';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlDatePicker } from './FormControlDatePicker';

export default {
  title: 'Components/Form/FormControlDatePicker',
  component: FormControlDatePicker,
} as ComponentMeta<typeof FormControlDatePicker>;

interface FormField {
  date: string;
}

const Template: ComponentStory<typeof FormControlDatePicker> = () => {
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
        <FormControlDatePicker<FormField> name="date" />
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
