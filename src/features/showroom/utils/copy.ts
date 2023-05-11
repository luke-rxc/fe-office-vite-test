export interface CopyOptions {
  onError?: (message: string) => any;
  onSuccess?: (text: string) => any;
  /**
   * 클립보드 복사를 위한 textarea가 일시적으로 append될 부모요소(default: body)
   *
   * 모달 안에서 복사 기능을 사용할 때 포커스 이슈로 body가 아닌
   * 모달컨테이너에 textarea가 append되어야한다.
   */
  container?: HTMLElement;
}

/**
 * 클립보드 복사 유틸
 */
export const copy = (text: string, options?: CopyOptions) => {
  const { onError, onSuccess, container = document.body } = options || {};

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

  container.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');

  container.removeChild(textarea);
  onSuccess && onSuccess(text);
};
