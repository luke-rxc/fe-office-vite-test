import { CategorySchema } from '../schemas';

export interface CategoryModel {
  label: string;
  value: string;
  readOnly: boolean;
  parentId: number;
}

export const toCategoryModel = (item: CategorySchema): CategoryModel => {
  return {
    label: item.name,
    value: item.id.toString(),
    readOnly: !item.isOpen,
    parentId: item.parentId,
  };
};

export const toCategoryModelList = (items: Array<CategorySchema>): Array<CategoryModel> => {
  return items.map(toCategoryModel);
};
