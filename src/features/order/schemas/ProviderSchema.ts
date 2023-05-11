/**
 * 입점사 combo schema
 */
export interface ProviderComboSchema {
  id: number;
  name: string;
}

/**
 * 입점사 combo list schema
 */
export interface ProviderComboListSchema {
  items: Array<ProviderComboSchema>;
}
