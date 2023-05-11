export enum LimitType {
  IFPAY = 'IFPAY',
  LIMIT = 'LIMIT',
  UNLIMIT = 'UNLIMIT',
}

export enum GoodsStatus {
  NORMAL = 'NORMAL',
  RUNOUT = 'RUNOUT',
  UNSOLD = 'UNSOLD',
}

export enum GoodsShippingPolicy {
  GOODS = 'GOODS',
  SHOP = 'SHOP',
}

export interface GoodsImage {
  fileId: number;
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
}

export interface PurchaseInfoSchema {
  minPurchaseLimit: LimitType;
  minPurchaseEa: number;
  maxPurchaseLimit: LimitType;
  maxPurchaseEa: number;
  userMaxPurchaseLimit: LimitType;
  userMaxPurchaseEa: number;
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
 * 상품 schema (추후 삭제 예정)
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
  salesEndDate: null;
  displayStartDate: number;
}
