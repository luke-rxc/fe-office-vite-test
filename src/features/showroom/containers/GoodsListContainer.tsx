import { useState, useMemo, useEffect } from 'react';
import { GoodsListItem } from '../types';
import { useGoodsListService } from '../services';
import { EditorCard } from '../components/base';
import { GoodsList } from '../components';
import { AddableGoodsListModalContainer } from './AddableGoodsListModalContainer';
import { BulkRegistrationGoodsModalContainer } from './BulkRegistrationGoodsModalContainer';

export interface GoodsListContainerProps {
  editorMode?: 'edit' | 'read' | 'create';
  isSectionDetail?: boolean;
  onChangeList?: (ids: number[]) => void;
}

/**
 * 전시상품 목록 컨테이너
 */
export const GoodsListContainer = ({
  isSectionDetail,
  editorMode,
  onChangeList: handleChangeList,
}: GoodsListContainerProps) => {
  const { mode, items, selectItemIds, isLoading, handler } = useGoodsListService();

  const [showModal, setShowModal] = useState<null | 'add' | 'bulk'>(null);
  const handleShowModal = (target: 'add' | 'bulk') => setShowModal(target);
  const handleHideModal = () => setShowModal(null);

  const isEdit = isSectionDetail ? editorMode !== 'read' : mode === 'edit';

  /**
   * 현재 테이블에 있는 상품 ID's
   */
  const addedIds = useMemo(() => (items || []).map(({ id }) => id), [items]);

  /**
   * 모달 확인 버튼 클릭 콜백
   */
  const handleConfirm = (addableItems: GoodsListItem[]) => {
    // 상품 추가
    handler.add(addableItems);
    // 모달 닫기
    setShowModal(null);
  };

  useEffect(() => {
    handleChangeList?.(addedIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedIds]);

  useEffect(() => {
    editorMode === 'read' && handler.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  return (
    <EditorCard
      title="상품 전시 관리"
      isEdit={mode === 'edit'}
      onEdit={!isSectionDetail && handler.edit}
      onSave={!isSectionDetail && handler.save}
      onCancel={!isSectionDetail && handler.cancel}
      onRefresh={!isSectionDetail && handler.refresh}
      sx={{ mt: 4 }}
    >
      <GoodsList
        isEdit={isEdit}
        isConcept={isSectionDetail}
        items={items}
        selectedIds={selectItemIds}
        isLoading={isLoading}
        onToTop={() => handler.order('top')}
        onToBottom={() => handler.order('bottom')}
        onToForward={() => handler.order('forward')}
        onToBackward={() => handler.order('backward')}
        onAdd={() => handleShowModal('add')}
        onBulkAdd={() => handleShowModal('bulk')}
        onRemove={handler.remove}
        onChangeSelect={handler.changeSelectItems}
      />

      {showModal === 'add' && (
        <AddableGoodsListModalContainer exceptIds={addedIds} onClose={handleHideModal} onConfirm={handleConfirm} />
      )}

      {showModal === 'bulk' && (
        <BulkRegistrationGoodsModalContainer addedIds={addedIds} onClose={handleHideModal} onConfirm={handleConfirm} />
      )}
    </EditorCard>
  );
};
