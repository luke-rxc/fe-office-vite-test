import { Modal } from '@components/Modal';
import { ReturnTypeUseShowtimeManageChatManagementShowroomSubscribeModalService } from '@features/showtime/services';
import { FormProvider } from 'react-hook-form';
import { ShowroomSubscribeForm } from './ShowroomSubscribeForm';

interface Props
  extends Omit<
    ReturnTypeUseShowtimeManageChatManagementShowroomSubscribeModalService,
    'handleClickShowroomSubscribe'
  > {}

/**
 * 쇼룸구독요청 modal component
 */
export const ShowroomSubscribeModal = ({
  formRef,
  showModal,
  formMethod,
  handleCloseModal,
  handleSubmit,
  handleClickSubmit,
  ...props
}: Props) => {
  return (
    <Modal
      title="쇼룸 팔로우 요청"
      width="700px"
      maxWidth="700px"
      minHeight="350px"
      maxHeight="100%"
      open={showModal}
      onClose={handleCloseModal}
      onConfirm={handleClickSubmit}
      confirmText="발송"
      onCancel={handleCloseModal}
    >
      <FormProvider {...formMethod}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <ShowroomSubscribeForm {...props} />
        </form>
      </FormProvider>
    </Modal>
  );
};
