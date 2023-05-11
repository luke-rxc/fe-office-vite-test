/** 정산 주기 Select 옵션 */
export const SettlementRoundOptions = [
  { value: 0, label: '전체' },
  { value: 1, label: '월 1회' },
  { value: 2, label: '월 2회' },
] as const;

/** 정산 회차 Select 옵션 */
export const SettlementCountOptions = [
  { value: 0, label: '전체' },
  { value: 1, label: '1회차' },
  { value: 2, label: '2회차' },
] as const;

/** 정산 여부 Select 옵션 */
export const SettlementPaidOptions = [
  { value: 'null', label: '전체' },
  { value: 'true', label: '지급' },
  { value: 'false', label: '미지급' },
] as const;

/** 세금계산서 발행 여부 Select 옵션 */
export const SettlementTaxOptions = [
  { value: 'null', label: '전체' },
  { value: 'true', label: '발행' },
  { value: 'false', label: '미발행' },
] as const;
