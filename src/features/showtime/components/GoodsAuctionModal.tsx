import { Modal } from '@components/Modal';
import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { AuctionModalTypeLabel } from '../constants';
import { KeywordComboItemModel } from '../models';
import { GoodsAuctionForm, SelectKeywords } from '.';
import { ReturnTypeUseShowtimeContentsAuctionGoodsService } from '../services';

interface Props {
  auction: ReturnTypeUseShowtimeContentsAuctionGoodsService['auction'];
  keywordOptions: Array<KeywordComboItemModel>;
}

export const GoodsAuctionModal = ({
  auction: {
    showModal,
    modalType,
    formMethod,
    ticketGoodsInfo,
    primaryImage,
    goodsImage,
    keyword,
    handleClose,
    handleSubmit,
  },
  keywordOptions,
}: Props) => {
  return (
    <Modal
      title={AuctionModalTypeLabel[modalType]}
      minWidth="1000px"
      maxHeight="1100px"
      open={showModal}
      onClose={handleClose}
    >
      <FormProvider {...formMethod}>
        <form>
          <GoodsAuctionForm
            primaryImage={primaryImage}
            goodsImage={goodsImage}
            ticketGoodsInfo={ticketGoodsInfo}
            formMethod={formMethod}
            modalType={modalType}
            keywordComponent={
              <SelectKeywords
                keywords={keyword.values}
                options={keywordOptions}
                onUpdateKeywords={keyword.handleUpdateKeywords}
                onDeleteKeywords={keyword.handleUpdateKeywords}
              />
            }
          />
          <Box display="flex" justifyContent="flex-end" alignContent="center" p={3}>
            <Button color="secondary" variant="contained" size="large" onClick={handleClose} sx={{ mr: '10px' }}>
              취소
            </Button>
            <Button color="primary" variant="contained" size="large" onClick={handleSubmit}>
              저장
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Modal>
  );
};
