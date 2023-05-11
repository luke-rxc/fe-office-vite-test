import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlRadioGroup } from './FormControlRadioGroup';

export default {
  title: 'Components/Form/FormControlRadioGroup',
  component: FormControlRadioGroup,
} as ComponentMeta<typeof FormControlRadioGroup>;

interface FormField {
  id: string;
}

interface OptionModel {
  value: string;
  label: string;
}

const options: Array<OptionModel> = [
  { value: 'option1', label: 'option1' },
  { value: 'option2', label: 'option2' },
  { value: 'option3', label: 'option3' },
];

const Template: ComponentStory<typeof FormControlRadioGroup> = () => {
  const formMethod = useForm<FormField>({
    defaultValues: {
      id: '',
    },
  });
  const { handleSubmit } = formMethod;

  const handleFormSubmit = handleSubmit((values: FormField) => {
    window.console.log('values', values);
  });

  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleFormSubmit}>
        <FormControlRadioGroup<FormField> name="id" options={options} sizes={[100, 200, 300]} row />
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
