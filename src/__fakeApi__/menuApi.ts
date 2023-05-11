import type { MenuTreeSchema } from '@schemas/MenuSchema';

class MenusApi {
  getMenusTree(): Promise<MenuTreeSchema> {
    const tree: MenuTreeSchema = {
      menus: [
        {
          id: 2,
          key: 'user',
          pairKey: 'user',
          name: '회원',
          children: [
            {
              id: 13,
              key: 'user',
              pairKey: 'user.user',
              name: '회원 조회/관리',
              children: [],
            },
          ],
        },
        {
          id: 3,
          key: 'provider',
          pairKey: 'provider',
          name: '입점사',
          children: [
            {
              id: 14,
              key: 'provider',
              pairKey: 'provider.provider',
              name: '입점사 조회/관리',
              children: [],
            },
            {
              id: 15,
              key: 'notice',
              pairKey: 'provider.notice',
              name: '공지관리',
              children: [],
            },
          ],
        },
        {
          id: 4,
          key: 'goods',
          pairKey: 'goods',
          name: '상품',
          children: [
            {
              id: 20,
              key: 'goods',
              pairKey: 'goods.goods',
              name: '상품 조회/관리',
              children: [],
            },
            {
              id: 21,
              key: 'category',
              pairKey: 'goods.category',
              name: '카테고리 관리',
              children: [],
            },
            {
              id: 22,
              key: 'qna',
              pairKey: 'goods.qna',
              name: '상품문의 관리',
              children: [],
            },
            {
              id: 29,
              key: 'review',
              pairKey: 'goods.review',
              name: '상품리뷰 관리',
              children: [],
            },
          ],
        },
        {
          id: 5,
          key: 'brand',
          pairKey: 'brand',
          name: '브랜드',
          children: [
            {
              id: 30,
              key: 'brand',
              pairKey: 'brand.brand',
              name: '브랜드 조회/관리',
              children: [],
            },
          ],
        },
        {
          id: 6,
          key: 'showroom',
          pairKey: 'showroom',
          name: '쇼룸',
          children: [
            {
              id: 44,
              key: 'showroom',
              pairKey: 'showroom.showroom',
              name: '쇼룸 조회/관리',
              children: [],
            },
          ],
        },
        {
          id: 7,
          key: 'contents',
          pairKey: 'contents',
          name: '컨텐츠',
          children: [
            {
              id: 45,
              key: 'showtime',
              pairKey: 'contents.showtime',
              name: '라이브 조회/관리',
              children: [],
            },
            {
              id: 48,
              key: 'story',
              pairKey: 'contents.story',
              name: '스토리 조회/관리',
              children: [],
            },
          ],
        },
        {
          id: 8,
          key: 'display',
          pairKey: 'display',
          name: '전시',
          children: [
            {
              id: 49,
              key: 'home',
              pairKey: 'display.home',
              name: '홈 관리',
              children: [
                {
                  id: 68,
                  key: 'menu1',
                  pairKey: 'display.home.menu1',
                  name: '메뉴 1',
                },
                {
                  id: 69,
                  key: 'menu2',
                  pairKey: 'display.home.menu2',
                  name: '메뉴 2',
                },
                {
                  id: 70,
                  key: 'menu3',
                  pairKey: 'display.home.menu3',
                  name: '메뉴 3',
                },
              ],
            },
            {
              id: 55,
              key: 'discovery',
              pairKey: 'display.discovery',
              name: '디스커버리 관리',
              children: [
                {
                  id: 71,
                  key: 'menu1',
                  pairKey: 'display.discovery.menu1',
                  name: '메뉴 1',
                },
                {
                  id: 72,
                  key: 'menu2',
                  pairKey: 'display.discovery.menu2',
                  name: '메뉴 2',
                },
                {
                  id: 73,
                  key: 'menu3',
                  pairKey: 'display.discovery.menu3',
                  name: '메뉴 3',
                },
              ],
            },
          ],
        },
        {
          id: 9,
          key: 'orders',
          pairKey: 'orders',
          name: '주문',
          children: [
            {
              id: 56,
              key: 'order',
              pairKey: 'orders.order',
              name: '주문 조회/관리',
              children: [],
            },
            {
              id: 57,
              key: 'export',
              pairKey: 'orders.export',
              name: '출고 관리',
              children: [],
            },
            {
              id: 58,
              key: 'return',
              pairKey: 'orders.return',
              name: '교환/반품 내역',
              children: [],
            },
            {
              id: 59,
              key: 'refund',
              pairKey: 'orders.refund',
              name: '환불 내역',
              children: [],
            },
          ],
        },
        {
          id: 10,
          key: 'charge',
          pairKey: 'charge',
          name: '정산',
          children: [
            {
              id: 60,
              key: 'sales',
              pairKey: 'charge.sales',
              name: '매출 현황 조회',
              children: [],
            },
            {
              id: 61,
              key: 'charge',
              pairKey: 'charge.charge',
              name: '정산 내역조회',
              children: [],
            },
          ],
        },
        {
          id: 11,
          key: 'marketing',
          pairKey: 'marketing',
          name: '마케팅',
          children: [
            {
              id: 62,
              key: 'coupon',
              pairKey: 'marketing.coupon',
              name: '쿠폰 관리',
              children: [],
            },
            {
              id: 63,
              key: 'charge',
              pairKey: 'marketing.charge',
              name: '푸시 메시지 관리',
              children: [],
            },
          ],
        },
        {
          id: 12,
          key: 'admin',
          pairKey: 'admin',
          name: '관리자',
          children: [
            {
              id: 64,
              key: 'manager',
              pairKey: 'admin.manager',
              name: '매니저 계정 관리',
              children: [],
            },
            {
              id: 65,
              key: 'partner',
              pairKey: 'admin.partner',
              name: '파트너 계정 관리',
              children: [],
            },
          ],
        },
        {
          id: 33,
          key: 'data',
          pairKey: 'data',
          name: '데이터',
          children: [
            {
              id: 66,
              key: 'sales1',
              pairKey: 'data.sales1',
              name: '매출 통계',
              children: [],
            },
            {
              id: 67,
              key: 'goods1',
              pairKey: 'data.goods1',
              name: '상품 통계',
              children: [],
            },
          ],
        },
      ],
    };

    return Promise.resolve(tree);
  }
}

export const menusApi = new MenusApi();
