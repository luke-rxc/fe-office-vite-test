export const BusinessType = {
  CORPORATE: 'CORPORATE',
  INDIVISUAL: 'INDIVISUAL',
  PRIVATE: 'PRIVATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BusinessType = typeof BusinessType[keyof typeof BusinessType];

export const BusinessTypeLabel: {
  [k in BusinessType]: string;
} = {
  CORPORATE: '법인',
  INDIVISUAL: '개인',
  PRIVATE: '일반 개인회원',
};
