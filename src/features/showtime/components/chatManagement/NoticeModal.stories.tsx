import { SendbirdNoticeMessageType } from '@features/showtime/constants';
import { ShowtimeChatStatusNoticeMessageFormField } from '@features/showtime/types';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NoticeModal } from './NoticeModal';

export default {
  title: 'Features/Showtime/chatManagement/NoticeModal',
  component: NoticeModal,
} as ComponentMeta<typeof NoticeModal>;

const Template: ComponentStory<typeof NoticeModal> = (args) => {
  const [showModal, setShowModal] = useState(true);

  const formMethod = useForm<ShowtimeChatStatusNoticeMessageFormField>({
    defaultValues: {
      messageType: SendbirdNoticeMessageType.FIX,
      message: '',
    },
  });

  const handleSubmit = formMethod.handleSubmit((values, event) => {
    event.preventDefault();
    window.console.log(values, event);
  });

  const handleClose = () => {
    setShowModal(false);
  };

  const props = {
    showModal,
    formMethod,
    handleClose,
    handleSubmit,
  };

  return <NoticeModal {...args} {...props} />;
};

export const Default = Template.bind({});
Default.args = {};
