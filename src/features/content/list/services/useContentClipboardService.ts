import { useClipboardCopy } from '@hooks/useClipboardCopy';

import toast from 'react-hot-toast';
export const useContentClipboardService = () => {
  const copy = useClipboardCopy();

  const onSuccessClipboardCopy = () => {
    toast.success('복사가 완료되었습니다.');
  };

  const onErrorClipboardCopy = () => {
    toast.error('복사 도중 문제가 발생하였습니다.');
  };

  const onClickClipboardCopy = (value: string, ref?: HTMLElement) => {
    return () => copy(value, { onSuccess: onSuccessClipboardCopy, onError: onErrorClipboardCopy }, ref);
  };

  return { onClickClipboardCopy };
};
