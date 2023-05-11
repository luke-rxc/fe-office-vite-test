/**
 * 브랜드 combo schema
 */
export interface BrandComboSchema {
  id: number;
  name: string;
}

/**
 * 브랜드 combo list schema
 */
export interface BrandComboListSchema {
  items: Array<BrandComboSchema>;
}
