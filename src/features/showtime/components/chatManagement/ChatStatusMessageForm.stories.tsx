import { ShowtimeChatStatusMessageFormField } from '@features/showtime/types';
import { Button } from '@material-ui/core';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ChatStatusMessageForm } from './ChatStatusMessageForm';

export default {
  title: 'Features/Showtime/ChatManagement/ChatStatusMessageForm',
  component: ChatStatusMessageForm,
} as ComponentMeta<typeof ChatStatusMessageForm>;

const Template: ComponentStory<typeof ChatStatusMessageForm> = (args) => {
  const formMethod = useForm<ShowtimeChatStatusMessageFormField>({
    defaultValues: {
      message: '',
    },
  });
  const { handleSubmit } = formMethod;

  const handleClickSend = handleSubmit((values) => {
    window.console.log(values);
  });

  const handleClickOpenNoticeModal = () => {
    window.console.log('open notice modal');
  };

  return (
    <FormProvider {...formMethod}>
      <ChatStatusMessageForm {...args}>
        <Button variant="contained" onClick={handleClickSend} sx={{ marginRight: '10px' }}>
          전송
        </Button>
        <Button variant="outlined" onClick={handleClickOpenNoticeModal}>
          공지
        </Button>
      </ChatStatusMessageForm>
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
