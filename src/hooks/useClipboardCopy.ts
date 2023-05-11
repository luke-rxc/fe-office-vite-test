// import { Button } from '@material-ui/core';
import React from 'react';
// import toast from 'react-hot-toast';

interface IClipboardCopyOptions {
  onError?: (message: string) => any;
  onSuccess?: () => any;
}

/**
 * 클립보드 복사 Hook
 * @example
 * ```
 * const copy = useClipboardCopy();
 *
 * copy('Copy Text');
 * ```
 */
export const useClipboardCopy = ({ onError: handleError, onSuccess: handleSuccess }: IClipboardCopyOptions = {}) => {
  return React.useCallback(
    (
      text: string,
      { onError, onSuccess }: IClipboardCopyOptions = { onError: handleError, onSuccess: handleSuccess }, // 이벤트 콜백
      appendTarget: HTMLElement = document.body, // 모달의 경우처럼 focus 문제로 복사되지 않는 케이스가 있어 append target 옵셔널 처리
    ) => {
      if (!document.queryCommandSupported('copy')) {
        return onError && onError('지원하지 않는 브라우저 입니다.');
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.width = '0';
      textarea.style.height = '0';
      textarea.style.top = '-1';
      textarea.style.left = '-1';
      textarea.style.position = 'fixed';

      appendTarget.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      appendTarget.removeChild(textarea);

      onSuccess && onSuccess();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
