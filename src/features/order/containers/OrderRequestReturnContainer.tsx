import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { OrderAddressModal, OrderRequestReturn, OrderReturnRetrieval } from '../components';
import { useOrderRequestReturnService, useOrderSearchAddressService } from '../services';

interface Props {
  orderId: string;
  onCloseModal: (refresh?: boolean) => void;
}

/**
 * 주문 반품 신청 container
 */
export const OrderRequestReturnContainer = ({ orderId, onCloseModal }: Props) => {
  const {
    form,
    returnItemOption,
    reasonItems,
    isAutoReturnable,
    isLoading,
    rowSelection,
    handleClickSelectShippingGroupGoodsOption,
    handleUpdateAddress,
  } = useOrderRequestReturnService({ orderId, onCloseModal });

  const { showAddressModal, handleClickShowAddressModal, handleClickHideAddressModal, addressRef, loadAddress } =
    useOrderSearchAddressService({ onUpdateAddress: handleUpdateAddress });

  if (isLoading) {
    return null;
  }

  return (
    <FormProvider {...form.formMethod}>
      <form onSubmit={form.handleSubmit}>
        <OrderRequestReturn
          returnItemOption={returnItemOption}
          reasonItems={reasonItems}
          rowSelection={rowSelection}
          onClickSelectShippingGroupGoodsOption={handleClickSelectShippingGroupGoodsOption}
        />
        <OrderReturnRetrieval
          isCancelExportTicket={returnItemOption.isCancelExportTicket}
          isAutoReturnable={isAutoReturnable}
          onClickShowAddressModal={handleClickShowAddressModal}
        />
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: '10px' }}>
          <Button type="submit" variant="contained">
            반품 요청
          </Button>
        </Box>
      </form>
      <OrderAddressModal
        openAddressModal={showAddressModal}
        ref={addressRef}
        loadAddressModule={loadAddress}
        onCloseModal={handleClickHideAddressModal}
      />
    </FormProvider>
  );
};
