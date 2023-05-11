import { OrderingType } from '../constants';

/**
 * items 내에서 위치 Swapping (sourceIdx, targetIdx 의 위치를 변경)
 *
 * @param {number} sourceIdx
 * @param {number} targetIdx
 */
export const handleSwap = (items: Array<any>, sourceIdx: number, targetIdx: number) => {
  if (sourceIdx < 0 || targetIdx < 0) {
    throw new Error('handleSwap: sourceIdx 와 targetIdx는 0보다는 커야 합니다.');
  }
  const duplicateFileInfos = items.slice();
  [duplicateFileInfos[sourceIdx], duplicateFileInfos[targetIdx]] = [
    duplicateFileInfos[targetIdx],
    duplicateFileInfos[sourceIdx],
  ];
  return duplicateFileInfos;
};

/** items 내의 위치를 최상단으로 이동 */
export const handleMoveTop = (items: Array<any>, idx: number) => {
  const duplicateFileInfos = items.slice();
  const moveData = duplicateFileInfos[idx];
  duplicateFileInfos.splice(idx, 1);
  duplicateFileInfos.unshift(moveData);
  return duplicateFileInfos;
};

/** items 내의 위치를 최하단으로 이동 */
export const handleMoveBottom = (items: Array<any>, idx: number) => {
  const duplicateFileInfos = items.slice();
  const moveData = duplicateFileInfos[idx];
  duplicateFileInfos.splice(idx, 1);
  duplicateFileInfos.push(moveData);
  return duplicateFileInfos;
};

/** 순서 변경된 items 리턴 */
export const getOrderedItems = <T extends {}>(items: Array<T>, index: number, orderingType: OrderingType): Array<T> => {
  const lastIndex = items.length - 1;

  switch (orderingType) {
    case OrderingType.FIRST:
      return handleMoveTop(items, index);
    case OrderingType.LAST:
      if (index === lastIndex) {
        return;
      }
      return handleMoveBottom(items, index);
    case OrderingType.PREV:
      if (index === 0) {
        return;
      }
      return handleSwap(items, index, index - 1);
    case OrderingType.NEXT:
      if (index === lastIndex) {
        return;
      }
      return handleSwap(items, index, index + 1);
  }
};
