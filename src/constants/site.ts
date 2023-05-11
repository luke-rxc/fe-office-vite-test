/**
 * 사이트 종류
 */
export const SiteType = {
  PARTNER: 'PARTNER',
  MANAGER: 'MANAGER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SiteType = ValueOf<typeof SiteType>;

/**
 * 사이트 종류 한글명
 */
export const SiteTypeKoreanMap = {
  [SiteType.PARTNER]: '파트너',
  [SiteType.MANAGER]: '매니저',
} as const;
