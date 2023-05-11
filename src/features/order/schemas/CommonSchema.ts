/**
 * 배송사 목록 combo item
 */
export interface DeliveryCompaniesComboItem {
  code: string;
  name: string;
}

/**
 *  combo bank schema
 */
export interface ComboBankSchema {
  value: string;
  name: string;
}

/**
 *  combo MD schema
 */
export interface ComboMDSchema {
  id: number;
  name: string;
}

/**
 * combo MD list schema
 */
export interface ComboMDListSchema {
  items: Array<ComboMDSchema>;
}
