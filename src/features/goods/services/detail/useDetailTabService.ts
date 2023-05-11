import { useState, useCallback, useRef } from 'react';
import { DetailTabType } from '../../constants';

export const useDetailTabService = () => {
  const [isTabFixed, setIsTabFixed] = useState(false);
  const scrollRef = useRef(null);
  const baseRef = useRef(null);
  const mediaRef = useRef(null);
  const optionRef = useRef(null);
  const noticeRef = useRef(null);
  const deliveryTabRef = useRef(null);

  const handleScroll = useCallback(
    (el: HTMLElement) => {
      /** @issue 스크롤에 따라 상태 변경 이슈가 있어, 우선 해당 부분 주석 처리 */
      // el.scrollTop >= 150 && isTabFixed === false && setIsTabFixed(true);
      // el.scrollTop < 150 && isTabFixed && setIsTabFixed(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTabFixed, setIsTabFixed],
  );

  // tab control
  const handleTabChange = (value: string): void => {
    const el =
      value === DetailTabType.BASE
        ? baseRef
        : value === DetailTabType.OPTION
        ? optionRef
        : value === DetailTabType.NOTICE
        ? noticeRef
        : value === DetailTabType.MEDIA
        ? mediaRef
        : value === DetailTabType.DELIVERY
        ? deliveryTabRef
        : null;

    /** @todo 상수 처리 */
    const scrollValue = el && el.current ? el.current.offsetTop - 48 : 0;

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollValue;
    }
  };

  return {
    isTabFixed,
    scrollRef,
    elementsRefs: { baseRef, mediaRef, optionRef, noticeRef, deliveryTabRef },
    handleScroll,
    handleTabChange,
  };
};
