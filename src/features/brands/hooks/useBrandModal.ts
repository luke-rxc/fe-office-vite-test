import { useEffect, useState } from 'react';
import { DetailMode } from '../constants';

export const useBrandModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<DetailMode>(DetailMode.CREATE);
  const [brandId, setBrandId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      return;
    }

    setMode(DetailMode.CREATE);
    setBrandId(null);
  }, [open]);

  const handleOpenModal = (mode?: DetailMode, brandId?: number) => {
    mode && handleChangeMode(mode, brandId);
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  const handleChangeMode = (mode: DetailMode, brandId?: number) => {
    setMode(mode);
    brandId && setBrandId(brandId);
  };

  return {
    open,
    mode,
    brandId,
    handleOpenModal,
    handleCloseModal,
    handleChangeMode,
  };
};
