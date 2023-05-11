import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

/**
 * @TODO 네이밍 변경 필요 (useMounted -> useWillUnMount)
 * [참고 링크] https://github.com/rxcompany/fe-office/pull/70
 */
const useMounted = (): MutableRefObject<boolean> => {
  const isMounted = useRef(true);

  useEffect(
    () => (): void => {
      isMounted.current = false;
    },
    [],
  );

  return isMounted;
};

export default useMounted;
