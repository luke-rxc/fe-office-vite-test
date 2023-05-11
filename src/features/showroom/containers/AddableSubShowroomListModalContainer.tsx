import { Divider } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { ShowroomListItem } from '../types';
import { useAddableSubShowroomListService } from '../services';
import { AddableSubShowroomSearch, AddableSubShowroomList } from '../components';

interface AddableSubShowroomListModalContainerProps {
  /** 검색시 제외할 쇼룸IDs */
  exceptIds: number[];
  /** 완료(추가)시 실행할 콜백 */
  onConfirm: (selectItem: ShowroomListItem[]) => void;
  /** 닫기시 실행할 콜백 */
  onClose: () => void;
}

/**
 * 소속쇼룸 추가 모달
 */
export const AddableSubShowroomListModalContainer = ({
  exceptIds,
  onClose: handleClose,
  onConfirm: handleConfirm,
}: AddableSubShowroomListModalContainerProps) => {
  const { list, selectedItems, selectedItemIds, total, isLoading, formMethods, formOptions, handler } =
    useAddableSubShowroomListService({ exceptIds });

  return (
    <Modal
      open
      width="100%"
      height="auto"
      maxWidth="1200px"
      maxHeight="90%"
      title="쇼룸 검색 / 추가"
      confirmText="추가"
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={() => handleConfirm(selectedItems)}
    >
      <AddableSubShowroomSearch
        formMethods={formMethods}
        formOptions={formOptions}
        onSearch={handler.search}
        onReset={handler.searchReset}
      />

      <Divider sx={{ mt: 3, mb: 3 }} />

      <AddableSubShowroomList
        total={total}
        items={list}
        isLoading={isLoading}
        selectedIds={selectedItemIds}
        selectedItems={selectedItems}
        page={formMethods.getValues('page')}
        size={formMethods.getValues('size')}
        onChangePage={handler.changePagination}
        onChangeSelect={handler.changeSelectItem}
        onChangeSelectAll={handler.changeSelectItemAll}
      />
    </Modal>
  );
};
