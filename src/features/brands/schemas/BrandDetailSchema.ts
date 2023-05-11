/**
 * 브랜드 상세 Schema
 */
export interface BrandDetailSchema {
  id: number;
  name: string;
  subName: string | null;
  description: string | null;
  image: {
    id: number;
    path: string;
    extension: string;
    width: number;
    height: number;
  };
  providerId: number;
  providerName: string;
  goodsCnt: number;
  md: {
    id: number;
    name: string;
  };
  amd: {
    id: number;
    name: string;
  };
  delete: boolean;
  commissionRate: number | null;
}
