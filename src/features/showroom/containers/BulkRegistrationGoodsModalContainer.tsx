import { useCallback, useMemo } from 'react';
import { Button } from '@material-ui/core';
import { Modal, Props as ModalProps } from '@components/Modal';
import { GoodsListItem } from '../types';
import { useBulkRegistrationGoodsService } from '../services';
import { BulkRegistrationGoods } from '../components';
interface BulkRegistrationGoodsModalContainerProps {
  /** 현재 전시상품 테이블에 있는 상품들의 ID */
  addedIds: number[];
  /** 닫기시 실행할 콜백 */
  onClose: () => void;
  /** 완료(추가)시 실행할 콜백 */
  onConfirm: (selectIds: GoodsListItem[]) => void;
}

export const BulkRegistrationGoodsModalContainer = ({
  addedIds,
  onClose: handleClose,
  onConfirm,
}: BulkRegistrationGoodsModalContainerProps) => {
  const { enterIds, successfulItems, failedItems, handlers } = useBulkRegistrationGoodsService({
    addedIds,
    onAdd: onConfirm,
  });

  const confirmProps = useMemo<Pick<ModalProps, 'confirmText' | 'disabled'>>(() => {
    if (successfulItems?.length) {
      return { confirmText: '성공건 등록' };
    }

    if (failedItems?.length) {
      return { confirmText: '성공건 등록', disabled: true };
    }

    if (enterIds.length) {
      return { confirmText: `${enterIds.length}건 등록` };
    }

    return { confirmText: '등록' };
  }, [enterIds, successfulItems, failedItems]);

  /**
   * 초기화 버튼 컴포넌트
   */
  const ResetAction = useCallback(() => {
    return enterIds.length ? (
      <Button variant="outlined" color="primary" onClick={handlers.reset} children="초기화" />
    ) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterIds]);

  return (
    <Modal
      open
      width="90%"
      height="auto"
      maxWidth="700px"
      maxHeight="90%"
      minHeight="325px"
      title="상품 일괄 등록"
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handlers.add}
      otherAction={<ResetAction />}
      {...confirmProps}
    >
      <BulkRegistrationGoods successfulItems={successfulItems} failedItems={failedItems} onEnter={handlers.enter} />
    </Modal>
  );
};
