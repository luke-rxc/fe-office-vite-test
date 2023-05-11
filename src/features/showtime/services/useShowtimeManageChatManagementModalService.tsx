import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { registShowtimeChatChannelMessage } from '../apis';
import { saveNoticeMessageKey, saveNoticeMessageMaxCount, SendbirdNoticeMessageType } from '../constants';
import { toShowtimeChatStatusNoticeMessageRegistRequestParamItem } from '../models';
import {
  ShowtimeChatStatusNoticeMessageFormField,
  ShowtimeChatStatusNoticeMessageRegistRequestParamItem,
} from '../types';

export const useShowtimeManageChatManagementModalService = (showTimeId: number) => {
  const [showModal, setShowModal] = useState(false);
  const [messageStorage, setMessageStorage] = useState<Array<string>>([]);
  const { open: dialogOpen } = useDialog();
  const formRef = useRef<HTMLFormElement>();

  const formMethodNotice = useForm<ShowtimeChatStatusNoticeMessageFormField>({
    defaultValues: {
      messageType: SendbirdNoticeMessageType.FIX,
      message: '',
    },
  });

  useEffect(() => {
    return () => {
      handleCloseNoticeModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const localMessages = JSON.parse(localStorage.getItem(`${saveNoticeMessageKey}_${showTimeId}`)) as Array<string>;
    if (localMessages) {
      setMessageStorage(localMessages);
    }
  }, [showTimeId]);

  const { mutateAsync: registChatChannelMessage } = useMutation(
    (params: ShowtimeChatStatusNoticeMessageRegistRequestParamItem) =>
      registShowtimeChatChannelMessage(showTimeId, params),
    {
      onError: (error, params) => {
        dialogOpen({
          content: `${
            params.messageType === SendbirdNoticeMessageType.SUBSCRIBE_SHOWROOM
              ? '쇼룸구독요청'
              : '공지메세지 등록 요청'
          }에 문제가 발생하였습니다.\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * 공지 메세지 추가
   */
  const addNoticeSaveMessage = (message: string) => {
    if (messageStorage.includes(message)) {
      return;
    }

    const messages = [...messageStorage, message];
    if (messages.length > saveNoticeMessageMaxCount) {
      messages.shift();
    }
    localStorage.setItem(`${saveNoticeMessageKey}_${showTimeId}`, JSON.stringify(messages));
    setMessageStorage(messages);
  };

  /**
   * 공지 메세지 등록 submit
   */
  const handleSubmitNotice = formMethodNotice.handleSubmit((values, event) => {
    event.preventDefault();

    dialogOpen({
      title: '확인',
      content: '공지메세지 등록 처리를 하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        await registChatChannelMessage(toShowtimeChatStatusNoticeMessageRegistRequestParamItem(values));

        handleCloseNoticeModal();

        dialogOpen({
          title: '알림',
          content: `공지메세지 등록 처리 되었습니다.`,
          type: DialogType.ALERT,
        });
      },
    });
  });

  /**
   * 공지 메세지 modal open
   */
  const handleOpenNoticeModal = () => {
    setShowModal(true);
  };

  /**
   * 공지 메세지 modal close
   */
  const handleCloseNoticeModal = () => {
    formMethodNotice.reset();
    setShowModal(false);
  };

  /**
   * 쇼룸 구독요청 메세지 발송
   */
  const handleClickShowroomSubscribe = () => {
    dialogOpen({
      title: '확인',
      content: '쇼룸구독요청 메세지를 발송하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        await registChatChannelMessage({
          messageType: SendbirdNoticeMessageType.SUBSCRIBE_SHOWROOM,
        });

        dialogOpen({
          title: '알림',
          content: `쇼룸구독요청 메세지 발송 처리 되었습니다.`,
          type: DialogType.ALERT,
        });
      },
    });
  };

  const handleClickNoticeMessageDeleteAction = () => {
    dialogOpen({
      title: '확인',
      content: '고정메세지 삭제 처리를 하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        await registChatChannelMessage(
          toShowtimeChatStatusNoticeMessageRegistRequestParamItem({
            messageType: SendbirdNoticeMessageType.FIX,
            message: '',
          }),
        );

        handleCloseNoticeModal();

        dialogOpen({
          title: '알림',
          content: `고정메세지 삭제 처리 되었습니다.`,
          type: DialogType.ALERT,
        });
      },
    });
  };

  /**
   * submit button click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  /**
   * 저장된 공지메세지 사용
   */
  const handleClickUseMessage = (message: string) => {
    return () => {
      formMethodNotice.setValue('message', message);
    };
  };

  /**
   * 저장된 공지메세지 삭제
   */
  const handleClickDeleteMessage = (itemIndex: number) => {
    return () => {
      const messages = messageStorage.filter((_, index) => index !== itemIndex);
      setMessageStorage(messages);
      localStorage.setItem(`${saveNoticeMessageKey}_${showTimeId}`, JSON.stringify(messages));
    };
  };

  /**
   * 공지메세지 추가 저장
   */
  const handleClickSaveMessage = () => {
    const message = formMethodNotice.getValues('message');

    if (message) {
      addNoticeSaveMessage(message);
    }
  };

  return {
    formRef,
    showModal,
    formMethodNotice,
    messageStorage,
    handleOpenNoticeModal,
    handleCloseNoticeModal,
    handleSubmitNotice,
    handleClickShowroomSubscribe,
    handleClickNoticeMessageDeleteAction,
    handleClickSubmit,
    handleClickUseMessage,
    handleClickDeleteMessage,
    handleClickSaveMessage,
  };
};
