import { useDialog } from '@hooks/useDialog';
import { DialogType, DialogProps } from '@models/DialogModel';
import { DialogFeedbackLabel } from '../constants';

interface DialogFeedbackProps {
  label?: DialogFeedbackLabel;
  message?: string;
  contentAlign?: DialogProps['contentAlign'];
  closeCb?: () => void;
  titleDisabled?: boolean;
}

interface DialogConfirmProps {
  title: string;
  message: string;
  confirmCb?: () => void;
  cancelCb?: () => void;
}

export const useDialogService = () => {
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const successDialog = ({
    label,
    message,
    contentAlign = 'center',
    closeCb,
    titleDisabled = false,
  }: DialogFeedbackProps) => {
    dialogOpen({
      title: !titleDisabled ? `${label ?? ''} 완료` : '',
      content: message ?? `${label ?? ''} 완료되었습니다`,
      contentAlign,
      type: DialogType.ALERT,
      onClose: () => {
        dialogClose();
        closeCb?.();
      },
    });
  };

  const errorDialog = ({
    label,
    message,
    contentAlign = 'center',
    closeCb,
    titleDisabled = false,
  }: DialogFeedbackProps) => {
    dialogOpen({
      title: !titleDisabled ? `${label ?? ''} 실패` : '',
      content: message ?? `${label ?? ''} 실패하였습니다.\r\n다시 한번 시도해 주세요`,
      contentAlign,
      type: DialogType.ALERT,
      onClose: () => {
        dialogClose();
        closeCb?.();
      },
    });
  };

  const confirmDialog = ({ title, message, confirmCb, cancelCb }: DialogConfirmProps) => {
    dialogOpen({
      title,
      content: message,
      contentAlign: 'center',
      type: DialogType.CONFIRM,
      onClose: () => {
        dialogClose();
        cancelCb?.();
      },
      onConfirm: () => {
        dialogClose();
        confirmCb?.();
      },
    });
  };

  return {
    successDialog,
    errorDialog,
    confirmDialog,
  };
};
