import { CategoryListSchema, CategorySelectItemSchema } from '../schemas';

// 카테고리 각각의 API 호출 > Select box 구성시 필요한 Model
export interface CategoryListModel {
  value: number;
  text: string;
}

const toCategoryModel = ({ name, id }: CategoryListSchema): CategoryListModel => {
  return { text: name, value: id };
};

export const toCategoryModelList = (items: CategoryListSchema[]): CategoryListModel[] => {
  return items.map(toCategoryModel);
};

// 선택된 카테고리 정보
export type CategorySelectItemModel = CategorySelectItemSchema;
