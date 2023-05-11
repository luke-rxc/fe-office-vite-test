import { createContext, useState } from 'react';
import { Dialog } from '@components/Dialog';
import { DialogType, DialogProps } from '@models/DialogModel';

const initialState: DialogProps = {
  isOpen: false,
  title: '',
  content: '',
  onClose: null,
  onConfirm: null,
};

export const DialogContext = createContext({
  open: (state: Partial<DialogProps>) => {},
  close: () => {},
});

export const DialogProvider = ({ children }) => {
  const [state, setState] = useState<DialogProps>(initialState);
  const open = ({
    title,
    content,
    onClose,
    onConfirm,
    type,
    confirmText,
    contentAlign,
    closeText,
    dialogProps,
  }: Partial<DialogProps>) => {
    setState((prevState: DialogProps) => ({
      ...prevState,
      isOpen: true,
      title,
      content,
      closeText,
      confirmText,
      contentAlign,
      onClose: onClose || close,
      onConfirm: onConfirm || close,
      type: type || DialogType.ALERT,
      dialogProps,
    }));
  };
  const close = () => {
    setState(() => ({ ...initialState }));
  };

  return (
    <>
      <DialogContext.Provider value={{ open, close }}>
        {children}
        <Dialog {...state} />
      </DialogContext.Provider>
    </>
  );
};
