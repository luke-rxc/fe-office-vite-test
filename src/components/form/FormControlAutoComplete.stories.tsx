import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlAutoComplete } from './FormControlAutoComplete';

export default {
  title: 'Components/Form/FormControlAutoComplete',
  component: FormControlAutoComplete,
} as ComponentMeta<typeof FormControlAutoComplete>;

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

const Template: ComponentStory<typeof FormControlAutoComplete> = () => {
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
        <FormControlAutoComplete<FormField>
          name="id"
          options={options}
          getOptionLabel={({ label }: OptionModel) => (label ? label : '')}
          isOptionEqualToValue={(v: OptionModel, o: OptionModel) => v.value === o.value}
        />
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
