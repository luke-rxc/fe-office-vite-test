import { Box, Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormControlSelect } from './FormControlSelect';

export default {
  title: 'Components/Form/FormControlSelect',
  component: FormControlSelect,
} as ComponentMeta<typeof FormControlSelect>;

interface FormField {
  id: string;
  name: string;
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

const Template: ComponentStory<typeof FormControlSelect> = () => {
  const formMethod = useForm<FormField>({
    defaultValues: {
      id: '',
      name: '',
    },
  });
  const { handleSubmit, watch } = formMethod;

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      window.console.log(name, values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFormSubmit = handleSubmit((values: FormField) => {
    window.console.log('values', values);
  });

  const onChange = (e) => {
    window.console.log(e);
  };

  return (
    <FormProvider {...formMethod}>
      <form onSubmit={handleFormSubmit}>
        <FormControlSelect<FormField> name="id" options={options} onChange={onChange} />
        <FormControlSelect<FormField> name="name" options={options} onChange={onChange} />
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
