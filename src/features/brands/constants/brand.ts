/**
 * 검색 기간 유형
 */
export const SearchDateType = {
  ALL: 'ALL',
  CREATED_DATE: 'CREATED_DATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SearchDateType = ValueOf<typeof SearchDateType>;

/**
 * 검색 조건
 */
export const SearchType = {
  NAME: 'NAME',
  ID: 'ID',
  PROVIDER: 'PROVIDER',
  MD: 'MD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SearchType = ValueOf<typeof SearchType>;

/**
 * 검색 조건 화면 Label
 */
export const SearchTypeLabel = {
  [SearchType.NAME]: '브랜드명',
  [SearchType.ID]: '브랜드ID',
  [SearchType.PROVIDER]: '입점사명',
  [SearchType.MD]: 'MD',
} as const;

/**
 * 브랜드 상세 모드
 */
export const DetailMode = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DetailMode = ValueOf<typeof DetailMode>;

/**
 * 브랜드 상세 Modal 제목
 */
export const BrandModalTitle = {
  [DetailMode.CREATE]: '신규 브랜드 생성',
  [DetailMode.READ]: '브랜드 상세',
  [DetailMode.UPDATE]: '브랜드 상세 (수정)',
} as const;

/**
 * 브랜드 상세 Modal Cancel 버튼 텍스트
 */
export const BrandModalCancelText = {
  [DetailMode.CREATE]: '취소하기',
  [DetailMode.READ]: '닫기',
  [DetailMode.UPDATE]: '취소하기',
} as const;

/**
 * 브랜드 상세 Modal Confirm 버튼 텍스트
 */
export const BrandModalConfirmText = {
  [DetailMode.CREATE]: '신규 생성하기',
  [DetailMode.READ]: '수정하기',
  [DetailMode.UPDATE]: '저장하기',
} as const;
