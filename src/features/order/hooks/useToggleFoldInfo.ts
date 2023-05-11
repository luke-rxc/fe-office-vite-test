import { useState } from 'react';

/**
 * 주문 공통 접기/펼치기 관련 hook
 */
export const useToggleFoldInfo = (defaultIsFold: boolean = true) => {
  const [isFold, setIsFold] = useState<boolean>(defaultIsFold);

  const handleToggleFold = () => {
    setIsFold((prev) => !prev);
  };

  return { isFold, handleToggleFold };
};
