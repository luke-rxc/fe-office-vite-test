/**
 * 브랜드 query keys
 */
export const BrandQueryKeys = {
  all: [{ scope: 'order-brand' }] as const,
  brandCombo: () => [{ ...BrandQueryKeys.all[0], entity: 'brand-combo' }] as const,
} as const;
