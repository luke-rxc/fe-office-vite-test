import { ShowtimeAnchorPointItemSchema } from '../schemas';

export const showtimeAnchorPointSchemaMock: Array<ShowtimeAnchorPointItemSchema> = [
  {
    id: 25,
    name: '테스트',
    imageType: undefined,
    imageId: null,
    goodsId: null,
    image: {
      id: 105,
      path: 'goods/20210701/f1678b66-a710-4c03-829d-572e1ddf274a',
      extension: 'jpeg',
      width: 10,
      height: 20,
    },
    seekingPositionSeconds: 41,
    active: true,
  },
];
