export const syncSortNumber = <T extends { sortNum: number }>(list: Array<T>): Array<T> => {
  return list.map((item, index) => {
    return {
      ...item,
      sortNum: index + 1,
    };
  });
};
