import { Modal } from '@components/Modal';
import { FormProvider } from 'react-hook-form';
import { ShowtimeGoodsList, ShowtimeGoodsSearchForm, GoodsSummary } from '../components';
import { ShowtimeGoodsModalProps, ShowtimeGoodsProps } from '../types';
import { useShowtimeGoodsService } from '../services';
import { Box } from '@material-ui/core';

interface Props {
  goods: ShowtimeGoodsProps;
  modal: ShowtimeGoodsModalProps;
}

export const ShowtimeGoodsContainer = ({ goods, modal }: Props) => {
  const {
    form,
    tableProps,
    summaryItems,
    handleAddSelectItem,
    handleConfirmAddGoods,
    handleCloseAddGoods,
    handleRemoveSelectItem,
  } = useShowtimeGoodsService({ goods, modal });

  return (
    <>
      <Modal
        title="상품검색"
        minWidth="800px"
        maxHeight="96vh"
        open={modal.showModal}
        onCancel={handleCloseAddGoods}
        confirmText="적용하기"
        cancelText="닫기"
        disabled={Object.is(goods.addedGoodsItems, summaryItems)}
        onConfirm={handleConfirmAddGoods}
      >
        <FormProvider {...form.formMethod}>
          <Box p="10px">
            <form onSubmit={form.handleSubmit}>
              <ShowtimeGoodsSearchForm
                disableAddItem={tableProps.rowSelection.selectedRowKeys.length === 0}
                onAddSelectItem={handleAddSelectItem}
              />
            </form>
            <ShowtimeGoodsList tableProps={tableProps} />
          </Box>
        </FormProvider>
        <GoodsSummary title="선택된 상품" items={summaryItems} onClickDelete={handleRemoveSelectItem} />
      </Modal>
    </>
  );
};
