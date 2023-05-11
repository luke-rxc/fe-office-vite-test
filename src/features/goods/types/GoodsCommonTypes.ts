// Selectbox 기본 Option
/** @deprecated */
export interface SelectOptionProp {
  text: string;
  value: string | number;
}

export interface SelectOptionPropV2 {
  label: string;
  value: string | number;
}

// 카테고리 검색
export interface SearchCategoryInfoProp {
  depth: number;
  value: number;
}

/**
 * Y, N 에 대한 Flag 변환
 */
export type BoolFlagType = 'Y' | 'N';
