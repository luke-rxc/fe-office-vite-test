export const useListService = () => {
  /**
   * 최상단 이동
   * @param keyArr
   * @param selectArr
   * @returns
   */
  const handleToFirst = (keyArr: number[], selectArr: number[]) => {
    const list = [...keyArr];
    const frontList = [];
    const backList = [];

    list.forEach((id) => {
      const isInclude = selectArr.includes(id);
      if (isInclude) {
        frontList.push(id);
      } else {
        backList.push(id);
      }
    });
    return [...frontList, ...backList];
  };

  /**
   * 최하단 이동
   * @param keyArr
   * @param selectArr
   * @returns
   */
  const handleToLast = (keyArr: number[], selectArr: number[]) => {
    const list = [...keyArr];
    const frontList = [];
    const backList = [];

    list.forEach((id) => {
      const isInclude = selectArr.includes(id);
      if (isInclude) {
        backList.push(id);
      } else {
        frontList.push(id);
      }
    });
    return [...frontList, ...backList];
  };

  /**
   * 위로 이동
   * @param keyArr
   * @param selectArr
   * @returns
   */
  const handleToFront = (keyArr: number[], selectArr: number[]) => {
    const list = [...keyArr];
    const moveItems = [];
    const stayItems = [];
    let sliceIndex;

    list.forEach((id, index) => {
      const isInclude = selectArr.includes(id);
      if (isInclude) {
        moveItems.push(id);
        sliceIndex = sliceIndex ?? Math.max(index - 1, 0);
      } else {
        stayItems.push(id);
      }
    });
    return [...stayItems.slice(0, sliceIndex), ...moveItems, ...stayItems.slice(sliceIndex)];
  };

  /**
   * 아래로 이동
   * @param arr
   * @param selectArr
   * @returns
   */
  const handleToBack = (arr: number[], selectArr: number[]) => {
    const list = [...arr];
    let sliceIndex;
    const moveItems = [];
    const stayItems = [];

    list.forEach((id, index) => {
      const isInclude = selectArr.includes(id);
      if (isInclude) {
        moveItems.push(id);
        sliceIndex = sliceIndex ?? index + 1;
      } else {
        stayItems.push(id);
      }
    });
    return [...stayItems.slice(0, sliceIndex), ...moveItems, ...stayItems.slice(sliceIndex)];
  };

  return {
    handleToFirst,
    handleToLast,
    handleToFront,
    handleToBack,
  };
};
