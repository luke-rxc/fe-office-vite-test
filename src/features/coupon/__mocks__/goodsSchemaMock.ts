import { PaginationResponse } from '@schemas/PaginationSchema';
import { GoodsModel } from '../models';
import { GoodsShippingPolicy, GoodsStatus, LimitType } from '../schemas';

export const goodsSchemaMock: PaginationResponse<GoodsModel> = {
  content: [
    {
      id: 139,
      name: '21ss 나이키 가방',
      brand: {
        id: 2,
        name: '나이키',
      },
      provider: {
        id: 45,
        name: '나이키',
      },
      status: 'NORMAL' as GoodsStatus,
      purchaseInfo: {
        minPurchaseLimit: 'LIMIT' as LimitType,
        minPurchaseEa: 1,
        maxPurchaseLimit: 'LIMIT' as LimitType,
        maxPurchaseEa: 100,
        userMaxPurchaseLimit: 'LIMIT' as LimitType,
        userMaxPurchaseEa: 10,
      },
      shippingInfo: {
        shippingPolicy: 'SHOP' as GoodsShippingPolicy,
        goodsShippingPolicy: 'UNLIMIT' as LimitType,
        unLimitShippingPrice: 0,
        limitShippingEa: 0,
        limitShippingPrice: 0,
        ifpayCost: 0,
        ifpayFreePrice: 0,
      },
      categories: [
        {
          one: {
            id: 27,
            name: '패션잡화',
          },
          two: {
            id: 28,
            name: '가방/지갑',
          },
          three: {
            id: 29,
            name: '가방',
          },
        },
      ],
      primaryImage: {
        fileId: 104,
        width: 10,
        height: 20,
        path: 'goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
      },
      consumerPrice: 100000,
      price: 90000,
      salesStartDate: 1625119293000,
      salesEndDate: null,
      displayStartDate: 1625119293000,
    },
    {
      id: 140,
      name: '소화가잘되는 우유',
      brand: {
        id: 14,
        name: '매일유업',
      },
      provider: {
        id: 38,
        name: '매일유업',
      },
      status: 'NORMAL' as GoodsStatus,
      purchaseInfo: {
        minPurchaseLimit: 'LIMIT' as LimitType,
        minPurchaseEa: 1,
        maxPurchaseLimit: 'LIMIT' as LimitType,
        maxPurchaseEa: 100,
        userMaxPurchaseLimit: 'LIMIT' as LimitType,
        userMaxPurchaseEa: 10,
      },
      shippingInfo: {
        shippingPolicy: 'SHOP' as GoodsShippingPolicy,
        goodsShippingPolicy: 'UNLIMIT' as LimitType,
        unLimitShippingPrice: 0,
        limitShippingEa: 0,
        limitShippingPrice: 0,
        ifpayCost: 0,
        ifpayFreePrice: 0,
      },
      categories: [],
      primaryImage: {
        fileId: 103,
        width: 10,
        height: 20,
        path: 'goods/20210701/4a83ed43-5282-4922-a70c-3f89ee551ca1',
      },
      consumerPrice: 2000,
      price: 1500,
      salesStartDate: 1625119645000,
      salesEndDate: null,
      displayStartDate: 1625119645000,
    },
    {
      id: 142,
      name: '셀렉스',
      brand: {
        id: 14,
        name: '매일유업',
      },
      provider: {
        id: 38,
        name: '매일유업',
      },
      status: 'NORMAL' as GoodsStatus,
      purchaseInfo: {
        minPurchaseLimit: 'LIMIT' as LimitType,
        minPurchaseEa: 1,
        maxPurchaseLimit: 'LIMIT' as LimitType,
        maxPurchaseEa: 100,
        userMaxPurchaseLimit: 'LIMIT' as LimitType,
        userMaxPurchaseEa: 10,
      },
      shippingInfo: {
        shippingPolicy: 'SHOP' as GoodsShippingPolicy,
        goodsShippingPolicy: 'UNLIMIT' as LimitType,
        unLimitShippingPrice: 0,
        limitShippingEa: 0,
        limitShippingPrice: 0,
        ifpayCost: 0,
        ifpayFreePrice: 0,
      },
      categories: [
        {
          one: {
            id: 5,
            name: '식품/건강',
          },
          two: {
            id: 33,
            name: '유제품',
          },
          three: {
            id: 35,
            name: '가공유',
          },
        },
      ],
      primaryImage: {
        fileId: 107,
        width: 10,
        height: 20,
        path: 'goods/20210701/09316356-ba34-4d8f-9295-4b90826dfae7',
      },
      consumerPrice: 2000,
      price: 1500,
      salesStartDate: 1625120142000,
      salesEndDate: null,
      displayStartDate: 1625120142000,
    },
    {
      id: 143,
      name: '설화수 로션',
      brand: {
        id: 15,
        name: '아모레퍼시픽',
      },
      provider: {
        id: 37,
        name: '아모레퍼시픽',
      },
      status: 'RUNOUT' as GoodsStatus,
      purchaseInfo: {
        minPurchaseLimit: 'LIMIT' as LimitType,
        minPurchaseEa: 1,
        maxPurchaseLimit: 'LIMIT' as LimitType,
        maxPurchaseEa: 100,
        userMaxPurchaseLimit: 'LIMIT' as LimitType,
        userMaxPurchaseEa: 10,
      },
      shippingInfo: {
        shippingPolicy: 'SHOP' as GoodsShippingPolicy,
        goodsShippingPolicy: 'UNLIMIT' as LimitType,
        unLimitShippingPrice: 0,
        limitShippingEa: 0,
        limitShippingPrice: 0,
        ifpayCost: 0,
        ifpayFreePrice: 0,
      },
      categories: [
        {
          one: {
            id: 2,
            name: '뷰티',
          },
          two: {
            id: 30,
            name: '화장품',
          },
          three: {
            id: 31,
            name: '로션',
          },
        },
      ],
      primaryImage: {
        fileId: 101,
        width: 10,
        height: 20,
        path: 'goods/20210701/ef568a7d-e1f2-4c3f-806d-cd192d9da742',
      },
      consumerPrice: 30000,
      price: 2500,
      salesStartDate: 1625120317000,
      salesEndDate: null,
      displayStartDate: 1625120317000,
    },
    {
      id: 144,
      name: '설화수 스킨',
      brand: {
        id: 15,
        name: '아모레퍼시픽',
      },
      provider: {
        id: 37,
        name: '아모레퍼시픽',
      },
      status: 'NORMAL' as GoodsStatus,
      purchaseInfo: {
        minPurchaseLimit: 'LIMIT' as LimitType,
        minPurchaseEa: 1,
        maxPurchaseLimit: 'LIMIT' as LimitType,
        maxPurchaseEa: 100,
        userMaxPurchaseLimit: 'LIMIT' as LimitType,
        userMaxPurchaseEa: 10,
      },
      shippingInfo: {
        shippingPolicy: 'SHOP' as GoodsShippingPolicy,
        goodsShippingPolicy: 'UNLIMIT' as LimitType,
        unLimitShippingPrice: 0,
        limitShippingEa: 0,
        limitShippingPrice: 0,
        ifpayCost: 0,
        ifpayFreePrice: 0,
      },
      categories: [
        {
          one: {
            id: 2,
            name: '뷰티',
          },
          two: {
            id: 30,
            name: '화장품',
          },
          three: {
            id: 32,
            name: '스킨',
          },
        },
      ],
      primaryImage: {
        fileId: 108,
        width: 10,
        height: 20,
        path: 'goods/20210701/6ae09d87-f8d7-4496-95c6-40859fd9845c',
      },
      consumerPrice: 30000,
      price: 2500,
      salesStartDate: 1625120378000,
      salesEndDate: null,
      displayStartDate: 1625120378000,
    },
  ],
  last: false,
  totalElements: 29,
  totalPages: 6,
  first: true,
  numberOfElements: 5,
  size: 5,
};
