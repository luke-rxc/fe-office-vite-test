import { Box, Button } from '@material-ui/core';
import { FormProvider } from 'react-hook-form';
import { OrderAddressModal, OrderExchangeRetrieval, OrderRequestExchange } from '../components';
import { useOrderRequestExchangeService, useOrderSearchAddressService } from '../services';

interface Props {
  orderId: string;
  onCloseModal: (refresh?: boolean) => void;
}

/**
 * 주문 교환 신청 container
 */
export const OrderRequestExchangeContainer = ({ orderId, onCloseModal }: Props) => {
  const {
    form,
    exchangeItemOption,
    returnReasonItems,
    isAutoReturnable,
    isLoading,
    rowSelection,
    handleClickSelectShippingGroupGoodsOption,
    handleUpdateAddress,
    handleChangeOptionEa,
    handleRemoveOptionItem,
    handleInsertOptionItem,
    handleClearErrorsOption,
    getOptionItemEaOptions,
  } = useOrderRequestExchangeService({ orderId, onCloseModal });

  const { showAddressModal, handleClickShowAddressModal, handleClickHideAddressModal, addressRef, loadAddress } =
    useOrderSearchAddressService({ onUpdateAddress: handleUpdateAddress });

  if (isLoading) {
    return null;
  }

  return (
    <FormProvider {...form.formMethod}>
      <form onSubmit={form.handleSubmit}>
        <OrderRequestExchange
          exchangeItemOption={exchangeItemOption}
          returnReasonItems={returnReasonItems}
          rowSelection={rowSelection}
          getOptionItemEaOptions={getOptionItemEaOptions}
          onClickSelectShippingGroupGoodsOption={handleClickSelectShippingGroupGoodsOption}
          onChangeOptionEa={handleChangeOptionEa}
          onRemoveOptionItem={handleRemoveOptionItem}
          onInsertOptionItem={handleInsertOptionItem}
          onClearErrorsOption={handleClearErrorsOption}
        />
        <OrderExchangeRetrieval
          isAutoReturnable={isAutoReturnable}
          onClickShowAddressModal={handleClickShowAddressModal}
        />
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: '10px' }}>
          <Button type="submit" variant="contained">
            교환 요청
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
