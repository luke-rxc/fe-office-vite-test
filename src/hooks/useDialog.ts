import { useContext } from 'react';
import { DialogContext } from '@contexts/DialogContext';

export const useDialog = () => {
  const ctx = useContext(DialogContext);

  return {
    open: ctx.open,
    close: ctx.close,
  };
};
