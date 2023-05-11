/**
 * log domain
 */
export const LogDomain = {
  ORDER: 'ORDER',
  ORDER_EXPORT: 'ORDER_EXPORT',
  ORDER_REFUND: 'ORDER_REFUND',
  ORDER_RETURN: 'ORDER_RETURN',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogDomain = typeof LogDomain[keyof typeof LogDomain];
