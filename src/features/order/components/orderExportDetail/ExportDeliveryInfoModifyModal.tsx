import { Modal } from '@components/Modal';
import { ReturnTypeUseOrderDeliveryModifyService } from '@features/order/services';
import { Box } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  open: boolean;
  children: ReactNode;
  disabled: boolean;
  onConfirm: ReturnTypeUseOrderDeliveryModifyService['handleClickSubmit'];
  onCloseModal: ReturnTypeUseOrderDeliveryModifyService['handleCloseModal'];
}

/**
 * 출고 운송정보 modal component
 */
export const ExportDeliveryInfoModifyModal = ({
  open,
  children,
  disabled,
  onConfirm: handleConfirm,
  onCloseModal: handleCloseModal,
}: Props) => {
  return (
    <Modal
      minWidth="600px"
      open={open}
      title="운송정보 수정"
      onConfirm={handleConfirm}
      onCancel={handleCloseModal}
      confirmText="수정하기"
      disabled={disabled}
    >
      <Box p="0 30px">{open ? children : null}</Box>
    </Modal>
  );
};
