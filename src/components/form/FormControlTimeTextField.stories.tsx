import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlTimeTextField } from './FormControlTimeTextField';

export default {
  title: 'Components/Form/FormControlTimeTextField',
  component: FormControlTimeTextField,
} as ComponentMeta<typeof FormControlTimeTextField>;

interface FormField {
  time: string;
}

const Template: ComponentStory<typeof FormControlTimeTextField> = () => {
  const formMethod = useForm<FormField>({
    defaultValues: {
      time: '',
    },
  });
  const { handleSubmit } = formMethod;

  const handleFormSubmit = handleSubmit((values: FormField) => {
    window.console.log('values', values);
  });

  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleFormSubmit}>
        <FormControlTimeTextField<FormField> name="time" label="TIME" />
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
