import { Modal } from '@components/Modal';
import { Box } from '@material-ui/core';
import { ReactNode } from 'react';
import { ReturnTypeUseRaffleEventCreateService } from '../services';

interface Props {
  open: boolean;
  children: ReactNode;
  onConfirm: ReturnTypeUseRaffleEventCreateService['handleClickSubmit'];
  onCloseModal: ReturnTypeUseRaffleEventCreateService['handleClickCancel'];
}

/**
 * 래플 이벤트 생성 modal component
 */
export const RaffleEventCreateModal = ({
  open,
  children,
  onConfirm: handleConfirm,
  onCloseModal: handleCloseModal,
}: Props) => {
  return (
    <Modal
      minWidth="800px"
      open={open}
      title="신규 이벤트 생성"
      onConfirm={handleConfirm}
      onCancel={handleCloseModal}
      confirmText="신규 생성하기"
    >
      <Box p="0 30px">{open ? children : null}</Box>
    </Modal>
  );
};
