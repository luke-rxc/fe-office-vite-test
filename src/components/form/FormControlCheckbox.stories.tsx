import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlCheckbox } from './FormControlCheckbox';

export default {
  title: 'Components/Form/FormControlCheckbox',
  component: FormControlCheckbox,
} as ComponentMeta<typeof FormControlCheckbox>;

interface FormField {
  id: boolean;
}

const Template: ComponentStory<typeof FormControlCheckbox> = () => {
  const formMethod = useForm<FormField>({
    defaultValues: {
      id: false,
    },
  });
  const { handleSubmit } = formMethod;

  const handleFormSubmit = handleSubmit((values: FormField) => {
    window.console.log('values', values);
  });

  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleFormSubmit}>
        <FormControlCheckbox<FormField> name="id" label="ID" />
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
