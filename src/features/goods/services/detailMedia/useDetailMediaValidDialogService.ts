import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import type { UploadMediaValidReturnProps } from '../../utils';

export const useDetailMediaValidDialogService = () => {
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const errorMediaValidDialog = (errors: UploadMediaValidReturnProps['errors']) => {
    dialogOpen({
      title: '등록 실패',
      content: errors
        .map(({ fileName, message }) => {
          return `· ${fileName} : ${message}\r\n`;
        })
        .join(''),
      contentAlign: 'left',
      type: DialogType.ALERT,
      onClose: dialogClose,
    });
  };
  return {
    errorMediaValidDialog,
  };
};
