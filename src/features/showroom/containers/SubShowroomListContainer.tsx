import { useState } from 'react';
import { useSubShowroomListService } from '../services';
import { ShowroomListItem } from '../types';
import { SubShowroomList } from '../components';
import { EditorCard } from '../components/base';
import { AddableSubShowroomListModalContainer } from './AddableSubShowroomListModalContainer';

/**
 * 소속쇼룸 목록 컨테이너
 */
export const SubShowroomListContainer = () => {
  const [showModal, setShowModal] = useState(false);
  const { mode, items, selectedItemIds, isLoading, handler } = useSubShowroomListService();
  const handleShowModal = () => setShowModal(true);
  const handleHideModal = () => setShowModal(false);

  /**
   * 모달 확인 버튼 클릭 콜백
   */
  const handleConfirm = (items: ShowroomListItem[]) => {
    // 쇼룸 추가
    handler.add(items);
    // 모달 닫기
    setShowModal(false);
  };

  return (
    <EditorCard
      title="콘텐츠 편성 쇼룸 관리"
      isEdit={mode === 'edit'}
      onEdit={handler.edit}
      onSave={handler.save}
      onCancel={handler.cancel}
      onRefresh={handler.refresh}
      sx={{ mt: 4 }}
    >
      {/* 소속쇼룸 목록 */}
      <SubShowroomList
        isEdit={mode === 'edit'}
        items={items}
        selectedIds={selectedItemIds}
        isLoading={isLoading}
        onAdd={handleShowModal}
        onRemove={handler.remove}
        onChangeSelect={handler.changeSelectItems}
      />

      {/* 등록가능 소속쇼룸 검색 및 추가 모달 */}
      {showModal && (
        <AddableSubShowroomListModalContainer
          exceptIds={items.map(({ id }) => id)}
          onConfirm={handleConfirm}
          onClose={handleHideModal}
        />
      )}
    </EditorCard>
  );
};
