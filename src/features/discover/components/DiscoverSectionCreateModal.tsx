import { Modal } from '@components/Modal';
import { Box } from '@material-ui/core';
import { ReactNode } from 'react';
import { ReturnTypeUseDiscoverSectionCreateService } from '../services';

interface Props {
  open: boolean;
  children: ReactNode;
  onConfirm: ReturnTypeUseDiscoverSectionCreateService['handleClickSubmit'];
  onCloseModal: ReturnTypeUseDiscoverSectionCreateService['handleClickCancel'];
}

/**
 * 디스커버 섹션 등록 modal component
 */
export const DiscoverSectionCreateModal = ({
  open,
  children,
  onConfirm: handleConfirm,
  onCloseModal: handleCloseModal,
}: Props) => {
  return (
    <Modal minWidth="800px" open={open} title="섹션 신규 생성" onConfirm={handleConfirm} onCancel={handleCloseModal}>
      <Box p="0 30px">{open ? children : null}</Box>
    </Modal>
  );
};
