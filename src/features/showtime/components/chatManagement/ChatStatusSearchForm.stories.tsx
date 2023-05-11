import { ShowtimeChatStatusSearchFormField } from '@features/showtime/types';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ChatStatusSearchForm } from './ChatStatusSearchForm';

export default {
  title: 'Features/Showtime/ChatManagement/ChatStatusSearchForm',
  component: ChatStatusSearchForm,
} as ComponentMeta<typeof ChatStatusSearchForm>;

const Template: ComponentStory<typeof ChatStatusSearchForm> = (args) => {
  const formMethod = useForm<ShowtimeChatStatusSearchFormField>({
    defaultValues: {
      searchType: 'all',
      keyword: '',
    },
  });
  const { handleSubmit } = formMethod;

  const handleClickSearch = handleSubmit((values) => {
    window.console.log(values);
  });

  return (
    <FormProvider {...formMethod}>
      <ChatStatusSearchForm {...args} onClickSearch={handleClickSearch} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
