import { AuctionGoodsType } from '../constants';
import { ShowtimeManageItemAuctionGoodsSchema } from '../schemas';

export const showtimeItemAuctionGoodsSchemaMock: Array<ShowtimeManageItemAuctionGoodsSchema> = [
  {
    id: 17,
    goodsId: 237,
    primaryImage: {
      id: 401,
      path: 'goods/20210830/748185ff-0348-4701-98ef-8b1541b3460a',
      extension: 'png',
      width: 470,
      height: 384,
    },
    name: '아이맥 271',
    startPrice: 980000,
    bidUnitPrice: 1000,
    status: 'WAITING',
    maximumBidPrice: 0,
    itemType: 'GOODS' as AuctionGoodsType,
    ticket: null,
  },
  {
    id: 16,
    goodsId: 236,
    primaryImage: {
      id: 401,
      path: 'goods/20210830/748185ff-0348-4701-98ef-8b1541b3460a',
      extension: 'png',
      width: 470,
      height: 384,
    },
    name: '아이맥 270',
    startPrice: 980000,
    bidUnitPrice: 1000,
    status: 'SUCCESSFUL_BID',
    maximumBidPrice: 0,
    itemType: 'GOODS' as AuctionGoodsType,
    ticket: null,
  },
];
