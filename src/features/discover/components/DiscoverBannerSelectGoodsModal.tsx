import { Modal } from '@components/Modal';
import { Box, Chip, Grid } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { ReturnTypeUseDiscoverAddGoodsService } from '../services';
import { DiscoverGoodsList } from './DiscoverGoodsList';
import { GoodsSearchForm } from './GoodsSearchForm';

interface Props extends ReturnTypeUseDiscoverAddGoodsService {}

export const DiscoverBannerSelectGoodsModal = ({
  isOpenModal,
  isLoading,
  goodsList,
  selectedGoodsList,
  brandList,
  providerList,
  rowSelection,
  pagination,
  form,
  handleCloseModal,
  handleClickRegistGoodsList,
  handleDeleteSelectGoods,
}: Props) => {
  return (
    <Modal
      title="상품 검색/추가"
      minWidth="96%"
      maxHeight="96vh"
      open={isOpenModal}
      confirmText="추가하기"
      cancelText="닫기"
      disabled={selectedGoodsList.length === 0}
      onClose={handleCloseModal}
      onCancel={handleCloseModal}
      onConfirm={handleClickRegistGoodsList}
    >
      <FormProvider {...form.formMethod}>
        <GoodsSearchForm form={form} brandCombo={brandList} providerCombo={providerList} />
      </FormProvider>
      {(selectedGoodsList ?? []).length > 0 && (
        <Box m="0 20px" sx={{ border: '1px solid #e8e8e8' }}>
          <Grid container spacing={1} p="10px">
            {selectedGoodsList.map((goods) => {
              return (
                <Grid item key={goods.goodsId}>
                  <Chip
                    label={`${goods.goodsName} (${goods.goodsId})`}
                    onDelete={handleDeleteSelectGoods(goods.rowKey)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
      <DiscoverGoodsList
        items={goodsList}
        isLoading={isLoading}
        pagination={pagination}
        rowSelection={rowSelection}
        hideSortNum
        hideAllSelect
      />
    </Modal>
  );
};
