import { FormProvider } from 'react-hook-form';
import { OrderRequestRefund } from '../components/common';
import { useOrderRequestRefundService } from '../services';

interface Props {
  orderId: string;
  onCloseModal: (refresh?: boolean) => void;
}

export const OrderRequestRefundContainer = ({ orderId, onCloseModal }: Props) => {
  const {
    form,
    refundItemOption,
    refundReasonItems,
    isLoading,
    rowSelection,
    handleClickSelectShippingGroupGoodsOption,
  } = useOrderRequestRefundService({ orderId, onCloseModal });

  if (isLoading) {
    return null;
  }

  return (
    <FormProvider {...form.formMethod}>
      <form onSubmit={form.handleSubmit}>
        <OrderRequestRefund
          refundItemOption={refundItemOption}
          refundReasonItems={refundReasonItems}
          rowSelection={rowSelection}
          onClickSelectShippingGroupGoodsOption={handleClickSelectShippingGroupGoodsOption}
        />
      </form>
    </FormProvider>
  );
};
