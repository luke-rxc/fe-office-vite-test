/** Goods Content Page Type */
export const GoodsContentType = {
  /** 대표 컨텐츠 */
  MAIN: 'MAIN',
  /** 상세 컨텐츠 */
  DETAIL: 'DETAIL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GoodsContentType = ValueOf<typeof GoodsContentType>;
