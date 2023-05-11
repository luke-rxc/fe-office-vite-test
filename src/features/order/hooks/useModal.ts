import { useEffect, useState } from 'react';

/**
 * 모달제어 관련 hook
 */
export const useModal = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setOpenModal(false);
    };
  }, []);

  /**
   * modal open
   */
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  /**
   * modal close
   */
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return { openModal, handleOpenModal, handleCloseModal };
};
