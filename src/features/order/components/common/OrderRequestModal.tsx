import { Modal } from '@components/Modal';
import { OrderRequestType, OrderRequestTypeLabel } from '@features/order/constants';
import {
  OrderRequestExchangeContainer,
  OrderRequestRefundContainer,
  OrderRequestReturnContainer,
} from '@features/order/containers';
import { useCallback } from 'react';

interface Props {
  orderId: string;
  requestType: OrderRequestType | null;
  openRequestModal: boolean;
  onCloseModal: (refresh?: boolean) => void;
}

/**
 * 주문 요청(취소,반품,교환) Modal component
 */
export const OrderRequestModal = ({
  orderId,
  requestType,
  openRequestModal,
  onCloseModal: handleCloseModal,
}: Props) => {
  const getRequestComponent = useCallback(() => {
    switch (requestType) {
      case OrderRequestType.EXCHANGE:
        return <OrderRequestExchangeContainer orderId={orderId} onCloseModal={handleCloseModal} />;
      case OrderRequestType.REFUND:
        return <OrderRequestRefundContainer orderId={orderId} onCloseModal={handleCloseModal} />;
      case OrderRequestType.RETURN:
        return <OrderRequestReturnContainer orderId={orderId} onCloseModal={handleCloseModal} />;

      default:
        return () => null;
    }
  }, [handleCloseModal, orderId, requestType]);

  if (requestType === null) {
    return null;
  }

  return (
    <Modal
      title={OrderRequestTypeLabel[requestType] ?? '요청'}
      open={openRequestModal}
      children={getRequestComponent()}
      width="100%"
      height="100%"
      onClose={() => handleCloseModal()}
      maxWidth="100%"
    />
  );
};
