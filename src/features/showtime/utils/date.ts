/**
 * 현재시간과 차이 millisecond
 */
export const getDiffMillisecondByToDate = (targetTimestamp: number, offset: number = 0) => {
  return Math.max(new Date(targetTimestamp).getTime() - new Date().getTime() + offset, 0);
};
