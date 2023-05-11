import { useState } from 'react';
import { OrderRequestType } from '../constants';

export type ReturnTypeUseOrderRequestService = ReturnType<typeof useOrderRequestService>;

interface Props {
  handleRefreshOrderDetail: () => void;
}

/**
 * 주문 요청(취소,반품,교환) 관련 service
 */
export const useOrderRequestService = ({ handleRefreshOrderDetail }: Props) => {
  const [orderRequestType, setOrderRequestType] = useState<OrderRequestType | null>(null);
  const [openRequestModal, setOpenRequestModal] = useState<boolean>(false);

  /**
   * 주문 요청 modal show
   */
  const handleClickShowRequestModal = (orderRequestType: OrderRequestType) => {
    return () => {
      setOrderRequestType(orderRequestType);
      setOpenRequestModal(true);
    };
  };

  /**
   * 주문 요청 modal hide
   */
  const handleClickHideRequestModal = (refresh?: boolean) => {
    setOrderRequestType(null);
    setOpenRequestModal(false);

    if (refresh) {
      handleRefreshOrderDetail();
    }
  };

  return { orderRequestType, openRequestModal, handleClickShowRequestModal, handleClickHideRequestModal };
};
