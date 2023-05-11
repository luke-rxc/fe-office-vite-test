/**
 * 리스트 order 변경관련 hook
 */
export const useOrder = <T = unknown>() => {
  /**
   * 리스트 선택, 비선택 분리
   */
  const getSplitItem = (list: Array<T>, selectedKeys: Array<string>, rowKey: keyof T) => {
    const selectedItems = list.filter((item) =>
      selectedKeys.map((item) => String(item)).includes(item[rowKey].toString()),
    );
    const unSelectedItems = list.filter(
      (item) => !selectedKeys.map((item) => String(item)).includes(item[rowKey].toString()),
    );
    return [selectedItems, unSelectedItems];
  };

  /**
   * 리스트 order 변경
   */
  const toMove = (list: Array<T>, selectedKeys: Array<string>, rowKey: keyof T, targetIndex: number) => {
    const [selectedItems, unSelectedItems] = getSplitItem(list, selectedKeys, rowKey);
    return [...unSelectedItems.slice(0, targetIndex), ...selectedItems, ...unSelectedItems.slice(targetIndex)];
  };

  /**
   * 리스트 order 변경확인
   */
  const order = (direction: string, list: Array<T>, selectedKeys: Array<string>, rowKey: keyof T) => {
    const startIndex = list.findIndex((item) => item[rowKey].toString() === selectedKeys[0].toString());
    if (startIndex < 0) {
      return;
    }

    const movePoint = (
      {
        bottom: list.length - selectedKeys.length,
        down: Math.min(startIndex + 1, list.length - 1),
        up: Math.max(startIndex - 1, 0),
        top: 0,
      } as Record<typeof direction, number>
    )[direction];

    return toMove(list, selectedKeys, rowKey, movePoint);
  };
  return { order };
};
