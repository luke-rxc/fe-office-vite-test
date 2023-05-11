import { Modal } from '@components/Modal';
import { ShowtimeChatStatusNoticeMessageFormField } from '@features/showtime/types';
import { Button } from '@material-ui/core';
import { MutableRefObject } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { NoticeForm } from './NoticeForm';
import { SaveNoticeMessages } from './SaveNoticeMessages';

interface Props {
  formRef: MutableRefObject<HTMLFormElement>;
  showModal: boolean;
  messageStorage: Array<string>;
  formMethod: UseFormReturn<ShowtimeChatStatusNoticeMessageFormField>;
  handleClose: (event: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  handleSubmit: () => void;
  handleClickUseMessage: (message: string) => () => void;
  handleClickDeleteMessage: (itemIndex: number) => () => void;
  handleClickSaveMessage: () => void;
  handleClickSubmit: () => void;
}

export const NoticeModal = ({
  formRef,
  showModal,
  messageStorage,
  formMethod,
  handleClose,
  handleSubmit,
  handleClickUseMessage,
  handleClickDeleteMessage,
  handleClickSaveMessage,
  handleClickSubmit,
}: Props) => {
  return (
    <Modal
      title="공지 메세지"
      width="800px"
      maxWidth="800px"
      minHeight="350px"
      maxHeight="100%"
      open={showModal}
      onClose={handleClose}
      onConfirm={handleClickSubmit}
      confirmText="저장"
      onCancel={handleClose}
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <NoticeForm />
          {messageStorage && (
            <SaveNoticeMessages
              messages={messageStorage}
              handleClickUseMessage={handleClickUseMessage}
              handleClickDeleteMessage={handleClickDeleteMessage}
            >
              <Button variant="contained" size="small" onClick={handleClickSaveMessage}>
                저장 메세지 추가
              </Button>
            </SaveNoticeMessages>
          )}
        </form>
      </FormProvider>
    </Modal>
  );
};
