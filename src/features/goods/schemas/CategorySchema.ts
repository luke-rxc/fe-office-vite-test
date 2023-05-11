import { CategoriesItem } from '@schemas/GoodsSchema';

export interface CategorySchema {
  categories: CategoryListSchema[];
}

export interface CategoryListSchema {
  id: number;
  name: string;
}

// 임시 저장 로드시 Category List Schema
export interface CategorySelectItemSchema extends CategoriesItem {
  // 주 카테고리, 추가 카테고리 여부
  primary: boolean;
}
