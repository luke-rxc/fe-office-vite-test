// provider 공통
/**
 * select
 */
export interface SelectTypeModel {
  label: string;
  code: number | string;
}

/**
 * 브랜드 정보
 */
export interface ProviderBrandModel {
  id: number; // 브랜드코드
  name: string; // 브랜드명
}
