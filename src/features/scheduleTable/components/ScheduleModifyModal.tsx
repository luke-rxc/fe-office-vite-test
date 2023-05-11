import { Modal } from '@components/Modal';
import { Box } from '@material-ui/core';
import { ReactNode } from 'react';
import { ReturnTypeUseScheduleModifyService } from '../services';

interface Props {
  open: boolean;
  children: ReactNode;
  onConfirm: ReturnTypeUseScheduleModifyService['actions']['handleClickSubmit'];
  onCloseModal: ReturnTypeUseScheduleModifyService['actions']['handleClickCloseModifySchedule'];
}

/**
 * 편성표 수정 modal component
 */
export const ScheduleModifyModal = ({
  open,
  children,
  onConfirm: handleConfirm,
  onCloseModal: handleCloseModal,
}: Props) => {
  return (
    <Modal
      open={open}
      title="편성 콘텐츠 수정"
      fullScreen
      maxWidth={1200}
      minWidth={800}
      maxHeight={1800}
      onConfirm={handleConfirm}
      onCancel={handleCloseModal}
    >
      <Box p="0 30px">{open ? children : null}</Box>
    </Modal>
  );
};
