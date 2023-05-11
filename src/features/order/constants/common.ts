/**
 * 주문 공통 query keys
 */
export const OrderCommonQueryKeys = {
  all: [{ scope: 'order-common' }] as const,
  lists: () => [{ ...OrderCommonQueryKeys.all[0], entity: 'list' }] as const,
  deliveryCompaniesList: () => [{ ...OrderCommonQueryKeys.lists()[0], entity: 'delivery-companies' }] as const,
  mdCombo: () => [{ ...OrderCommonQueryKeys.lists()[0], entity: 'md-combo' }] as const,
  bankCombo: () => [{ ...OrderCommonQueryKeys.lists()[0], entity: 'bank-combo' }] as const,
} as const;

/**
 * ExcelDownloadType
 */
export const ExcelDownloadType = {
  ALL: 'ALL',
  SELECTION: 'SELECTION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ExcelDownloadType = typeof ExcelDownloadType[keyof typeof ExcelDownloadType];
