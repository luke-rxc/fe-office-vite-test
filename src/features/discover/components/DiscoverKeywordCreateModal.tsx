import { Modal } from '@components/Modal';
import { Box } from '@material-ui/core';
import { ReactNode } from 'react';
import { ReturnTypeUseDiscoverKeywordCreateService } from '../services';

interface Props {
  open: boolean;
  children: ReactNode;
  onConfirm: ReturnTypeUseDiscoverKeywordCreateService['handleClickSubmit'];
  onCloseModal: ReturnTypeUseDiscoverKeywordCreateService['handleClickCancel'];
}

/**
 * 디스커버 키워드 등록 modal component
 */
export const DiscoverKeywordCreateModal = ({
  open,
  children,
  onConfirm: handleConfirm,
  onCloseModal: handleCloseModal,
}: Props) => {
  return (
    <Modal
      minWidth="800px"
      open={open}
      title="신규 키워드 생성"
      confirmText="신규 생성하기"
      onConfirm={handleConfirm}
      onCancel={handleCloseModal}
    >
      <Box p="0 30px">{open ? children : null}</Box>
    </Modal>
  );
};
