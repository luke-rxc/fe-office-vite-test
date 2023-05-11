export interface CategorySchema {
  id: number;
  parentId: number;
  name: string;
  level: number;
  sortNumber: number;
  commissionRate: number;
  createDate: number;
  updateDate: number;
  isOpen: boolean;
}
