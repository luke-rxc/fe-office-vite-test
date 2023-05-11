import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlColorPicker } from './FormControlColorPicker';

export default {
  title: 'Components/Form/FormControlColorPicker',
  component: FormControlColorPicker,
} as ComponentMeta<typeof FormControlColorPicker>;

interface FormField {
  color: string;
}

const Template: ComponentStory<typeof FormControlColorPicker> = () => {
  const formMethod = useForm<FormField>({
    defaultValues: {
      color: '',
    },
  });
  const { handleSubmit } = formMethod;

  const handleFormSubmit = handleSubmit((values: FormField) => {
    window.console.log('values', values);
  });

  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleFormSubmit}>
        <FormControlColorPicker<FormField> name="color" placeholder="컬러 입력" />
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
