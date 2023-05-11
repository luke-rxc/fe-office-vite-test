import Calendar from '@assets/icons/Calendar';
import BriefcaseIcon from './assets/icons/Briefcase';
import FolderOpenIcon from './assets/icons/FolderOpen';
import ShoppingCartIcon from './assets/icons/ShoppingCart';
import UserIcon from './assets/icons/User';
import ConfirmationNumber from '@material-ui/icons/ConfirmationNumber';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import type { PermissionSectionsModel } from './models/MenuModel';

export const sections: PermissionSectionsModel[] = [
  {
    pairKey: 'general',
    title: '일반',
    items: [
      {
        pairKey: 'general.account',
        title: '내 계정 정보',
        path: '/account',
        icon: <UserIcon fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'user',
    title: '사용자',
    items: [
      {
        pairKey: 'user.user',
        title: '사용자 조회/관리',
        path: '/member',
        icon: <UserIcon fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'provider',
    title: '입점사',
    items: [
      {
        pairKey: 'provider.provider',
        title: '입점사 조회/관리',
        path: '/provider/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
      // 연동 menu 에는 있으나 제작되지 않은 부분은 주석처리
      /* {
        pairKey: 'provider.notice',
        title: '공지관리',
        path: '/provider/notice',
        icon: <FolderOpenIcon fontSize="small" />,
      }, */
    ],
  },
  {
    pairKey: 'brand',
    title: '브랜드',
    items: [
      {
        pairKey: 'brand.brand',
        title: '브랜드 조회/관리',
        path: '/brands',
        icon: <FolderOpenIcon fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'goods',
    title: '상품',
    items: [
      {
        pairKey: 'goods.goods',
        title: '상품 조회/관리',
        path: '/goods',
        icon: <ShoppingCartIcon fontSize="small" />,
      },
      {
        pairKey: 'goods.bulk',
        title: '상품 일괄수정',
        path: '/bulk',
        icon: <ShoppingCartIcon fontSize="small" />,
      },
      {
        pairKey: 'goods.category',
        title: '카테고리 관리',
        path: '/categories',
        icon: <ShoppingCartIcon fontSize="small" />,
      },
      {
        pairKey: 'goods.inspection',
        title: '상품 검수 관리',
        path: '/sale-request',
        icon: <ShoppingCartIcon fontSize="small" />,
      },
      // 연동 menu 에는 있으나 제작되지 않은 부분은 주석처리
      /* {
        pairKey: 'goods.qna',
        title: '상품문의 관리',
        path: '/qna',
        icon: <ShoppingCartIcon fontSize="small" />,
      },
      {
        pairKey: 'goods.review',
        title: '상품리뷰 관리',
        path: '/review',
        icon: <ShoppingCartIcon fontSize="small" />,
      }, */
    ],
  },
  {
    pairKey: 'showroom',
    title: '쇼룸',
    items: [
      {
        pairKey: 'showroom.showroom',
        title: '쇼룸 조회/관리',
        path: '/showroom',
        icon: <BriefcaseIcon fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'contents',
    title: '콘텐츠',
    items: [
      {
        pairKey: 'contents.contents',
        title: '콘텐츠 조회/관리',
        path: '/content/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'live',
    title: '라이브',
    items: [
      {
        pairKey: 'live.live',
        title: '라이브 조회/관리',
        path: '/showtime/contents/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'display',
    title: '전시',
    items: [
      {
        pairKey: 'display.home',
        title: '홈 관리',
        path: '/home-manage',
        icon: <FolderOpenIcon fontSize="small" />,
        children: [
          {
            pairKey: 'display.home.banner',
            title: '메인 배너 관리',
            path: '/display/home/banner',
          },
          {
            pairKey: 'display.home.banner_shortcut',
            title: '메인 숏컷배너 관리',
            path: '/display/home/shortcut',
          },
          {
            pairKey: 'display.home.feed',
            title: '메인 피드 관리',
            path: '/display/home/feed',
          },
        ],
      },
      {
        pairKey: 'display.discovery',
        title: '디스커버 관리',
        path: '/discover',
        icon: <FolderOpenIcon fontSize="small" />,
        children: [
          {
            pairKey: 'display.discovery',
            title: '디스커버 배너 관리',
            path: '/display/discover/banner/list',
          },
          {
            pairKey: 'display.discovery',
            title: '디스커버 피드 관리',
            path: '/display/discover/feed/list',
          },
          {
            pairKey: 'display.discovery',
            title: '디스커버 섹션 관리',
            path: '/display/discover/section/list',
          },
          {
            pairKey: 'display.discovery',
            title: '키워드 관리',
            path: '/display/discover/keyword/list',
          },
        ],
      },
      {
        pairKey: 'display.contents_schedule',
        title: '편성표 관리',
        path: '/schedule-table',
        icon: <Calendar fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'orders',
    title: '주문',
    items: [
      {
        pairKey: 'orders.order',
        title: '주문 목록',
        path: '/order/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
      {
        pairKey: 'orders.export_prepare',
        title: '송장 등록 대기',
        path: '/export/prepare/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
      {
        pairKey: 'orders.export',
        title: '출고/배송 목록',
        path: '/export/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
      {
        pairKey: 'orders.export_ticket',
        title: '출고(티켓) 목록',
        path: '/export/ticket/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
      {
        pairKey: 'orders.return',
        title: '반품/교환 목록',
        path: '/return/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
      {
        pairKey: 'orders.refund',
        title: '환불 목록',
        path: '/refund/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
    ],
  },
  // 연동 menu 에는 있으나 제작되지 않은 부분은 주석처리
  /* {
    pairKey: 'charge',
    title: '정산',
    items: [
      {
        pairKey: 'charge.sales',
        title: '매출 현황 조회',
        path: '/sales',
        icon: <ReceiptIcon fontSize="small" />,
      },
      {
        pairKey: 'charge.charge',
        title: '정산 내역 조회',
        path: '/settles',
        icon: <ReceiptIcon fontSize="small" />,
      },
    ],
  }, */
  {
    pairKey: 'settlement',
    title: '정산',
    items: [
      {
        pairKey: 'settlement.settlement',
        title: '정산 조회/관리(구)',
        path: '/settlement/list',
        icon: <FolderOpenIcon fontSize="small" />,
      },
    ],
  },
  {
    pairKey: 'marketing',
    title: '마케팅',
    items: [
      {
        pairKey: 'marketing.coupon',
        title: '쿠폰 관리',
        path: '/coupon/list',
        icon: <ConfirmationNumber fontSize="small" />,
      },
      {
        pairKey: 'marketing.live_raffle',
        title: '추첨 이벤트 관리',
        path: '/raffle-event/list',
        icon: <EmojiEvents fontSize="small" />,
      },
      // 연동 menu 에는 있으나 제작되지 않은 부분은 주석처리
      /* {
        pairKey: 'marketing.charge',
        title: '푸시 메시지 관리',
        path: '/notifications',
        icon: <ChatAltIcon fontSize="small" />,
      }, */
    ],
  },

  {
    pairKey: 'admin',
    title: '관리자',
    items: [
      {
        pairKey: 'admin.manager',
        title: '매니저 계정 관리',
        path: '/roles/managers',
        icon: <UserIcon fontSize="small" />,
      },
      {
        pairKey: 'admin.partner',
        title: '파트너 계정 관리',
        path: '/roles/partners',
        icon: <UserIcon fontSize="small" />,
      },
    ],
  },
  // 연동 menu 에는 있으나 제작되지 않은 부분은 주석처리
  /* {
    pairKey: 'data',
    title: '데이터',
    items: [
      {
        pairKey: 'data.sales1',
        title: '매출 통계',
        path: '/data-center-1',
        icon: <ClipboardListIcon fontSize="small" />,
      },
      {
        pairKey: 'data.goods1',
        title: '상품 통계',
        path: '/data-center-2',
        icon: <ClipboardListIcon fontSize="small" />,
      },
    ],
  }, */
];
