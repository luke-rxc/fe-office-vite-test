import { useState } from 'react';

export interface CouponPolicyServiceReturn {
  modalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  handleConfirm: () => void;
}

/**
 * 쿠폰정책 Layout(modal) 관련 service
 */
export const useCouponPolicyLayoutService = (): CouponPolicyServiceReturn => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleConfirm = () => {
    handleModalClose();
  };

  return {
    modalOpen,
    handleModalOpen,
    handleModalClose,
    handleConfirm,
  };
};
