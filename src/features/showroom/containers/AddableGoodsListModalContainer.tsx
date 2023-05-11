import { Divider } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { GoodsListItem } from '../types';
import { useAddableGoodsListService } from '../services';
import { AddableGoodsSearch, AddableGoodsList } from '../components';

interface AddableGoodsListModalContainerProps {
  /** 검색시 제외할 쇼룸IDs */
  exceptIds: number[];
  /** 완료(추가)시 실행할 콜백 */
  onConfirm: (selectIds: GoodsListItem[]) => void;
  /** 닫기시 실행할 콜백 */
  onClose: () => void;
}

/**
 * 전시상품 추가 모달
 */
export const AddableGoodsListModalContainer = ({
  exceptIds,
  onClose: handleClose,
  onConfirm: handleConfirm,
}: AddableGoodsListModalContainerProps) => {
  const { list, selectedItems, selectedItemIds, total, isLoading, formMethods, formOptions, handler } =
    useAddableGoodsListService({ exceptIds });

  return (
    <Modal
      open
      width="100%"
      height="auto"
      maxWidth="1900px"
      maxHeight="90%"
      title="상품 검색 / 추가"
      confirmText="추가"
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={() => handleConfirm(selectedItems)}
    >
      <AddableGoodsSearch
        formMethods={formMethods}
        formOptions={formOptions}
        onSearch={handler.search}
        onReset={handler.searchReset}
      />

      <Divider sx={{ mt: 3, mb: 3 }} />

      <AddableGoodsList
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
