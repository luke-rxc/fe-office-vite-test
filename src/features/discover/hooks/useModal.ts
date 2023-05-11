import { useState } from 'react';

/**
 * Modal open 관련 hook
 */
export const useModal = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return {
    isOpenModal,
    handleOpenModal,
    handleCloseModal,
  };
};
