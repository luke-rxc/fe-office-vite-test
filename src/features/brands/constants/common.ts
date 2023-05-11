/**
 * Combo Type
 */
export const ComboType = {
  BRAND: 'BRAND',
  BRAND_NO_PROVIDER: 'BRAND_NO_PROVIDER',
  PROVIDER: 'PROVIDER',
  PROVIDER_ACTIVE: 'PROVIDER_ACTIVE',
  MD: 'MD',
  // AMD
  GOODS_MANAGER: 'GOODS_MANAGER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ComboType = ValueOf<typeof ComboType>;
