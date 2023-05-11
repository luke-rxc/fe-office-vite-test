import { useEffect, useState } from 'react';
import { ShowtimeGoodsModalProps } from '../types';

/**
 * 쇼타임 modal hook
 */
export const useShowtimeModal = (): ShowtimeGoodsModalProps => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    return () => {
      setShowModal(false);
    };
  }, []);

  /**
   * Modal open
   */
  const handleOpenModal = () => {
    setShowModal(true);
  };

  /**
   * Modal close
   */
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    handleOpenModal,
    handleCloseModal,
  };
};
