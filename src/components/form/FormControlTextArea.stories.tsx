import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlTextArea } from './FormControlTextArea';

export default {
  title: 'Components/Form/FormControlTextArea',
  component: FormControlTextArea,
} as ComponentMeta<typeof FormControlTextArea>;

interface FormField {
  name: string;
}

const Template: ComponentStory<typeof FormControlTextArea> = () => {
  const formMethod = useForm<FormField>({
    defaultValues: {
      name: '',
    },
  });
  const { handleSubmit } = formMethod;

  const handleFormSubmit = handleSubmit((values: FormField) => {
    window.console.log('values', values);
  });

  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleFormSubmit}>
        <FormControlTextArea<FormField> name="name" />
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
