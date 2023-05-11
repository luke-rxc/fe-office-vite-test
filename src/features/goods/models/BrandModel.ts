import { BrandSchema } from '../schemas';

export interface BrandModel {
  // 입점사 이름
  label: string;
  // 입점사 id
  value: number;
  // 입점사 수수료
  commissionRate?: number;
}

export const toBrand = ({ name, id, account: { commissionRate } }: BrandSchema): BrandModel => ({
  label: name,
  value: id,
  commissionRate,
});

export const toBrandList = (items: BrandSchema[]): BrandModel[] => {
  return items.map(toBrand);
};
