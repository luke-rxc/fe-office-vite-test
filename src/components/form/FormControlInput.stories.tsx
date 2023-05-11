import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlInput } from './FormControlInput';

export default {
  title: 'Components/Form/FormControlInput',
  component: FormControlInput,
} as ComponentMeta<typeof FormControlInput>;

interface FormField {
  name: string;
}

const Template: ComponentStory<typeof FormControlInput> = ({ triggerPressEnterSubmit }) => {
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
        <FormControlInput<FormField> name="name" triggerPressEnterSubmit={triggerPressEnterSubmit} />
        <Box p="5px 0" />
        <Button type="submit" variant="contained">
          SUBMIT
        </Button>
      </form>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  triggerPressEnterSubmit: false,
};
