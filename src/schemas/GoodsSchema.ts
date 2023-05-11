import {
  GoodsShippingPolicy,
  LimitType,
  GoodsStatus,
  GoodsShippingMethod,
  PurchaseLimitedType,
} from '@constants/goods';

export interface GoodsImage {
  /** @issue Side-effect 방지하기 위하여 우선 universal 로 선언 */
  id?: number;
  originalFileName?: string;
  extension?: string;
  fileId?: number;
  width: number;
  height: number;
  path: string;
}

export interface CategoriesItem {
  one: {
    id: number;
    name: string;
  };
  two: {
    id: number;
    name: string;
  };
  three: {
    id: number;
    name: string;
  };
}

export interface ShippingInfoSchema {
  shippingPolicy: GoodsShippingPolicy;
  goodsShippingPolicy: LimitType;
  unLimitShippingPrice: number;
  limitShippingEa: number;
  limitShippingPrice: number;
  ifpayCost: number;
  ifpayFreePrice: number;
  /** @issue Side-effect 방지하기 위하여 우선 universal 로 선언 */
  shippingMethod?: GoodsShippingMethod;
}

export interface PurchaseInfoSchema {
  minPurchaseLimit: LimitType;
  minPurchaseEa: number;
  maxPurchaseLimit: LimitType;
  maxPurchaseEa: number;
  userMaxPurchaseLimit: LimitType;
  userMaxPurchaseEa: number;
  /**
   * 한정수량 설정
   * @issue Side-effect 방지하기 위하여 우선 universal 로 선언
   */
  limitedType?: PurchaseLimitedType;
  limitedGoodsEa?: number | null;
}

export interface GoodsProviderSchema {
  id: number;
  name: string;
}

export interface GoodsBrandSchema {
  id: number;
  name: string;
}

/**
 * 상품 schema
 */
export interface GoodsSchema {
  id: number;
  name: string;
  brand: GoodsBrandSchema;
  provider: GoodsProviderSchema;
  status: GoodsStatus;
  purchaseInfo: PurchaseInfoSchema;
  shippingInfo: ShippingInfoSchema;
  categories: Array<CategoriesItem>;
  primaryImage: GoodsImage;
  consumerPrice: number;
  price: number;
  salesStartDate: number;
  salesEndDate: number | null;
  displayStartDate: number;
}

/**
 * 상품 검색 태그 Schema
 */
export interface GoodsSearchTagSchema {
  id: number;
  value: string;
}
