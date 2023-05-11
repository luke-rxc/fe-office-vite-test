import { PaginationResponse } from '@schemas/PaginationSchema';
import { ShowtimeContentsSchema } from '../schemas';

/**
 * Showtime 콘텐츠 mock
 */
export const showtimeContentsSchemaMock: PaginationResponse<ShowtimeContentsSchema> = {
  content: [
    {
      id: 6,
      contentsType: 'STANDARD',
      title: '일반형 라이브 콘텐츠',
      showRoomName: 'rxc show room',
      goodsCount: 3,
      goodsName: '나이키 펜츠',
      primaryImage: {
        extension: 'png',
        id: 42,
        path: '',
        width: 100,
        height: 200,
      },
      liveStartDate: 1626854152422,
      liveStatus: 'LIVE',
      openStatus: 'PUBLIC',
    },
    {
      id: 7,
      contentsType: 'STANDARD',
      title: '일반형 라이브 콘텐츠',
      showRoomName: 'rxc show room',
      goodsCount: 3,
      goodsName: '나이키 펜츠',
      primaryImage: {
        extension: 'png',
        id: 45,
        path: '',
        width: 100,
        height: 200,
      },
      liveStartDate: 1626854152475,
      liveStatus: 'LIVE',
      openStatus: 'PUBLIC',
    },
    {
      id: 8,
      contentsType: 'STANDARD',
      title: '일반형 라이브 콘텐츠',
      showRoomName: 'rxc show room',
      goodsCount: 3,
      goodsName: '나이키 펜츠',
      primaryImage: {
        extension: 'png',
        id: 48,
        path: '',
        width: 100,
        height: 200,
      },
      liveStartDate: 1626854152514,
      liveStatus: 'LIVE',
      openStatus: 'PUBLIC',
    },
  ],
  totalElements: 3,
  totalPages: 1,
  last: true,
  numberOfElements: 3,
  size: 20,
  first: true,
};
