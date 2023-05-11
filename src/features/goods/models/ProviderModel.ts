import { ProvideListInfoSchema } from '../schemas';

/**
 * @description
 * - 일괄수정 부터 Luke 제작한 새로운 컴포넌트 사용
 * - 해당 인터페이스 맞춤
 * @todo 차후 다른 컴포넌트들도 맞게 변경해야 함
 */
export interface ProviderModel {
  // 입점사 이름
  label: string;
  // 입점사 id
  value: number;
  // 입점사 수수료
  commissionRate: number;
}

export const toProviderModel = ({ name, id, account: { commissionRate } }: ProvideListInfoSchema): ProviderModel => ({
  label: name,
  value: id,
  commissionRate,
});

export const toProviderModelList = (items: ProvideListInfoSchema[]): ProviderModel[] => {
  return items.map(toProviderModel);
};
