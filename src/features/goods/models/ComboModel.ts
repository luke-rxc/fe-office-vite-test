import { ComboListSchema } from '../schemas';

/**
 * @description
 * - 일괄수정 부터 Luke 제작한 새로운 컴포넌트 사용
 * - 해당 인터페이스 맞춤
 * @todo 차후 다른 컴포넌트들도 맞게 변경해야 함
 */
export interface ComboModel {
  label: ComboListSchema['name'];
  value: ComboListSchema['id'];
}

const toComboModel = ({ name, id }: ComboListSchema): ComboModel => {
  return { label: name, value: id };
};

export const toComboModelList = (items: ComboListSchema[]): ComboModel[] => {
  if (items && items.length) {
    return items.map(toComboModel);
  }
  return [];
};
