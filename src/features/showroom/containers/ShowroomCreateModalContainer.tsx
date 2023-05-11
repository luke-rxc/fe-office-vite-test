import React from 'react';
import { Modal } from '@components/Modal';
import { ShowroomForm } from '../components';
import { useShowroomCreateService } from '../services';

interface ShowroomCreateModalContainerProps {
  /** 모달 닫기시 실행할 콜백 */
  onClose: () => void;
}

/**
 * 쇼룸 생성 모달 컨테이너
 */
export const ShowroomCreateModalContainer: React.FC<ShowroomCreateModalContainerProps> = ({ onClose: handleClose }) => {
  const { formMethods, formOptions, handler } = useShowroomCreateService({
    onCancel: handleClose,
    onSuccess: handleClose,
  });

  return (
    <Modal
      open
      width="100%"
      height="100%"
      maxWidth={500}
      maxHeight={530}
      title="쇼룸 신규 생성"
      confirmText="신규 생성하기"
      onConfirm={handler.create}
      onCancel={handler.cancel}
      onClose={handler.cancel}
    >
      <ShowroomForm mode="create" formMethods={formMethods} formOptions={formOptions} />
    </Modal>
  );
};
