/**
 * 공통 Combo Api Schema
 */
export interface ComboSchema {
  items: ComboListSchema[];
}

export interface ComboListSchema {
  id: number;
  name: string;
}
