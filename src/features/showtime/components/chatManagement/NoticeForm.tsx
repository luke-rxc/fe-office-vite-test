import { FormControlRadioGroup, FormControlTextArea, FormLayout } from '..';
import { SendbirdNoticeMessageType, SendbirdNoticeMessageTypeLabel } from '@features/showtime/constants';
import { ShowtimeChatStatusNoticeMessageFormField } from '@features/showtime/types';

const messageTypeOptions = [
  { label: SendbirdNoticeMessageTypeLabel[SendbirdNoticeMessageType.FIX], value: SendbirdNoticeMessageType.FIX },
  {
    label: SendbirdNoticeMessageTypeLabel[SendbirdNoticeMessageType.TEMPORARY],
    value: SendbirdNoticeMessageType.TEMPORARY,
  },
];

export const NoticeForm = () => {
  return (
    <>
      <FormLayout label="메세지 종류">
        <FormControlRadioGroup<ShowtimeChatStatusNoticeMessageFormField>
          name="messageType"
          options={messageTypeOptions}
        />
      </FormLayout>
      <FormLayout label="메세지">
        <FormControlTextArea<ShowtimeChatStatusNoticeMessageFormField>
          name="message"
          minRows={4}
          width="550px"
          placeholder="공지메세지를 입력하세요 (최대100자)"
          maxLength={100}
          rules={{ required: '공지메세지를 입력하세요' }}
        />
      </FormLayout>
    </>
  );
};
