import { SendBirdMessageType } from '@features/showtime/models';
import { ShowtimeChatStatusMessageFormField, ShowtimeChatStatusSearchFormField } from '@features/showtime/types';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { ChatStatus } from './ChatStatus';

export default {
  title: 'Features/Showtime/ChatManagement/ChatStatus',
  component: ChatStatus,
} as ComponentMeta<typeof ChatStatus>;

const Template: ComponentStory<typeof ChatStatus> = (args) => {
  const searchFormMethod = useForm<ShowtimeChatStatusSearchFormField>({
    defaultValues: {
      searchType: 'all',
      keyword: '',
    },
  });

  const messageFormMethod = useForm<ShowtimeChatStatusMessageFormField>({
    defaultValues: {
      message: '',
    },
  });

  const chatItems: Array<SendBirdMessageType> = [];

  const { handleSubmit: handleSubmitSearch } = searchFormMethod;
  const { handleSubmit: handleSubmitMessage } = messageFormMethod;

  const handleClickSend = handleSubmitMessage((values) => {
    window.console.log(values);
  });

  const handleClickOpenNoticeModal = () => {
    window.console.log('open notice modal');
  };

  const handleClickSearch = handleSubmitSearch((values) => {
    window.console.log(values);
  });

  return (
    <ChatStatus
      {...args}
      items={chatItems}
      searchFormMethod={searchFormMethod}
      messageFormMethod={messageFormMethod}
      onClickSearch={handleClickSearch}
      onClickSend={handleClickSend}
      onClickOpenNoticeModal={handleClickOpenNoticeModal}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
