import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { registShowtimeChatChannelMessage } from '../apis';
import { SendbirdNoticeMessageType, ShowroomType } from '../constants';
import { ShowroomComboItemModel, ShowtimeContentsItemModel } from '../models';
import {
  ShowtimeChatShowroomSubscribeFormField,
  ShowtimeChatStatusNoticeMessageRegistRequestParamItem,
} from '../types';

export type ReturnTypeUseShowtimeManageChatManagementShowroomSubscribeModalService = ReturnType<
  typeof useShowtimeManageChatManagementShowroomSubscribeModalService
>;

interface Props {
  showTimeId: number;
  showtimeContentsItem: ShowtimeContentsItemModel;
  showroomComboList: Array<ShowroomComboItemModel>;
}

export const useShowtimeManageChatManagementShowroomSubscribeModalService = ({
  showTimeId,
  showtimeContentsItem,
  showroomComboList,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { open: dialogOpen } = useDialog();
  const formRef = useRef<HTMLFormElement>();

  const formMethod = useForm<ShowtimeChatShowroomSubscribeFormField>({
    defaultValues: {
      showroomType: 'HOST',
      hostShowroomId: showtimeContentsItem.showRoomId,
      guestShowroom: null,
      etcShowroom: null,
    },
  });

  useEffect(() => {
    return () => {
      handleCloseModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutateAsync: registChatChannelMessage } = useMutation(
    (params: ShowtimeChatStatusNoticeMessageRegistRequestParamItem) =>
      registShowtimeChatChannelMessage(showTimeId, params),
    {
      onError: (error, params) => {
        dialogOpen({
          content: `'쇼룸구독요청'에 문제가 발생하였습니다.\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * 쇼룸ID 조회
   */
  const getShowroomId = (values: ShowtimeChatShowroomSubscribeFormField) => {
    const { showroomType, hostShowroomId, guestShowroom, etcShowroom } = values;

    switch (showroomType) {
      case ShowroomType.HOST:
        return hostShowroomId;
      case ShowroomType.GUEST:
        return guestShowroom.value;
      case ShowroomType.ETC:
        return etcShowroom.value;
    }
  };

  /**
   * 쇼룸 구독요청 submit
   */
  const handleSubmit = formMethod.handleSubmit(async (values, event) => {
    event.preventDefault();

    await registChatChannelMessage({
      messageType: SendbirdNoticeMessageType.SUBSCRIBE_SHOWROOM,
      showRoomId: getShowroomId(values),
    });

    handleCloseModal();

    dialogOpen({
      title: '알림',
      content: `쇼룸구독요청 메세지 발송 처리 되었습니다.`,
      type: DialogType.ALERT,
    });
  });

  /**
   * modal open
   */
  const handleOpenModal = () => {
    setShowModal(true);
  };

  /**
   * modal close
   */
  const handleCloseModal = () => {
    formMethod.reset();
    setShowModal(false);
  };

  /**
   * 쇼룸 구독요청 모달 open
   */
  const handleClickShowroomSubscribe = () => {
    handleOpenModal();
  };

  /**
   * submit button click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return {
    formRef,
    showModal,
    formMethod,
    showtimeContentsItem,
    showroomComboList,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleClickShowroomSubscribe,
    handleClickSubmit,
  };
};
