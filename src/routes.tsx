import { lazy, Suspense } from 'react';
import type { PartialRouteObject } from 'react-router';
import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';
import LoadingScreen from './components/LoadingScreen';
import PermissionGuard from './components/PermissionGuard';
import OfficeLayout from './containers/OfficeLayout';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// 인증 페이지
const Login = Loadable(lazy(() => import('./features/authentication/pages/Login')));
const PasswordRecovery = Loadable(lazy(() => import('./features/authentication/pages/PasswordRecovery')));
const PasswordReset = Loadable(lazy(() => import('./features/authentication/pages/PasswordReset')));
const Register = Loadable(lazy(() => import('./features/authentication/pages/Register')));
const VerifyCode = Loadable(lazy(() => import('./features/authentication/pages/VerifyCode')));

// 일반 페이지
const Analytics = Loadable(lazy(() => import('./features/analytics/pages/Analytics')));
const Finance = Loadable(lazy(() => import('./features/finance/pages/Finance')));
const Account = Loadable(lazy(() => import('./features/account/pages/AccountPage')));
const AccountLogout = Loadable(lazy(() => import('./features/account/pages/AccountLogoutPage')));

// 회원 관리 페이지

const MemberManagementListPage = Loadable(lazy(() => import('./features/member/pages/MemberManagementListPage')));
const MemberManagementDetailPage = Loadable(lazy(() => import('./features/member/pages/MemberManagementDetailPage')));
const ProviderNoticePage = Loadable(lazy(() => import('./features/provider/pages/ProviderNoticePage')));
const ProviderListPage = Loadable(lazy(() => import('./features/provider/pages/ProviderListPage')));
const ProviderDetailPage = Loadable(lazy(() => import('./features/provider/pages/ProviderDetailPage')));
const ShippingCountryAddressPage = Loadable(lazy(() => import('./features/provider/pages/ShippingCountryAddressPage')));
const DormantDetails = Loadable(lazy(() => import('./features/dormant/pages/DormantDetails')));
const DormantEdit = Loadable(lazy(() => import('./features/dormant/pages/DormantEdit')));
const DormantList = Loadable(lazy(() => import('./features/dormant/pages/DormantList')));

// 쇼타임 콘텐츠 관리 페이지
const ShowtimeContentsList = Loadable(lazy(() => import('./features/showtime/pages/ShowtimeContentsListPage')));
const ShowtimeContentsCreate = Loadable(lazy(() => import('./features/showtime/pages/ShowtimeContentsCreatePage')));
const ShowtimeContentsModify = Loadable(lazy(() => import('./features/showtime/pages/ShowtimeContentsModifyPage')));

// 쇼타임 운영 대시보드
const ShowtimeManageDashboard = Loadable(lazy(() => import('./features/showtime/pages/ShowtimeManageDashboardPage')));

// 콘텐츠 페이지
const ContentList = Loadable(lazy(() => import('./features/content/list/pages/ContentListPage')));
const ContentBuilder = Loadable(lazy(() => import('./features/content/builder/pages/ContentBuilderPage')));
const ContentReplyManager = Loadable(lazy(() => import('./features/content/reply/pages/ReplyManagerPage')));

// 전시 관리 페이지
const MainBannerList = Loadable(lazy(() => import('./features/display/pages/MainBannerListPage')));
const MainFeedList = Loadable(lazy(() => import('./features/display/pages/MainFeedListPage')));
const MainBannerDetail = Loadable(lazy(() => import('./features/display/pages/MainBannerDetailPage')));
const MainFeedDetail = Loadable(lazy(() => import('./features/display/pages/MainFeedDetailPage')));
const MainBannerCreate = Loadable(lazy(() => import('./features/display/pages/MainBannerCreatePage')));
const MainFeedCreate = Loadable(lazy(() => import('./features/display/pages/MainFeedCreatePage')));

const MainShortcutList = Loadable(lazy(() => import('./features/shortcut/pages/MainShortcutListPage')));
const MainShortcutModify = Loadable(lazy(() => import('./features/shortcut/pages/MainShortcutModifyPage')));
const MainShortcutCreate = Loadable(lazy(() => import('./features/shortcut/pages/MainShortcutCreatePage')));

// 디스커버 관리 페이지
const DiscoverBannerList = Loadable(lazy(() => import('./features/discover/pages/DiscoverBannerListPage')));
const DiscoverBannerCreate = Loadable(lazy(() => import('./features/discover/pages/DiscoverBannerCreatePage')));
const DiscoverBannerModify = Loadable(lazy(() => import('./features/discover/pages/DiscoverBannerModifyPage')));

const DiscoverSectionList = Loadable(lazy(() => import('./features/discover/pages/DiscoverSectionListPage')));
const DiscoverSectionModify = Loadable(lazy(() => import('./features/discover/pages/DiscoverSectionModifyPage')));

const DiscoverFeedList = Loadable(lazy(() => import('./features/discover/pages/DiscoverFeedListPage')));
const DiscoverFeedCreate = Loadable(lazy(() => import('./features/discover/pages/DiscoverFeedCreatePage')));
const DiscoverFeedModify = Loadable(lazy(() => import('./features/discover/pages/DiscoverFeedModifyPage')));

const DiscoverKeywordList = Loadable(lazy(() => import('./features/discover/pages/DiscoverKeywordListPage')));
const DiscoverKeywordModify = Loadable(lazy(() => import('./features/discover/pages/DiscoverKeywordModifyPage')));

// 편성표 페이지
const ScheduleTable = Loadable(lazy(() => import('./features/scheduleTable/pages/ScheduleTablePage')));

// 상품 관리 페이지
const Categories = Loadable(lazy(() => import('./features/categories/pages/CategoriesPage')));
const GoodsCreate = Loadable(lazy(() => import('./features/goods/pages/GoodsCreatePage')));
const GoodsModify = Loadable(lazy(() => import('./features/goods/pages/GoodsModifyPage')));
const GoodsList = Loadable(lazy(() => import('./features/goods/pages/GoodsListPage')));
/** 상품 검수 */
const GoodsSaleRequestList = Loadable(lazy(() => import('./features/goods/pages/GoodsSaleRequestListPage')));
/** 상품 컨텐츠 보기 */
const GoodsContenList = Loadable(lazy(() => import('./features/goods/pages/GoodsContentPage')));

/** 상품일괄 수정 */
const GoodsBulkList = Loadable(lazy(() => import('./features/goods/pages/GoodsBulkPage')));
const GoodsBulkDetail = Loadable(lazy(() => import('./features/goods/pages/GoodsBulkDetailPage')));

// 브랜드 관리 페이지
const BrandListPage = Loadable(lazy(() => import('./features/brands/pages/BrandListPage')));
const BrandDetailPage = Loadable(lazy(() => import('./features/brands/pages/BrandDetailPage')));

// 쿠폰 관리 페이지
const CouponList = Loadable(lazy(() => import('./features/coupon/pages/CouponListPage')));
// 쿠폰 등록 페이지
const CouponCreate = Loadable(lazy(() => import('./features/coupon/pages/CouponCreatePage')));
// 쿠폰 수정 페이지
const CouponModify = Loadable(lazy(() => import('./features/coupon/pages/CouponModifyPage')));

// 주문/배송 관리 페이지
const OrderList = Loadable(lazy(() => import('./features/order/pages/OrderListPage')));
const OrderDetail = Loadable(lazy(() => import('./features/order/pages/OrderDetailPage')));

// 송장 등록 대기 페이지
const OrderExportPrepareList = Loadable(lazy(() => import('./features/order/pages/OrderExportPrepareListPage')));

// 출고 관리 페이지
const OrderExportList = Loadable(lazy(() => import('./features/order/pages/OrderExportListPage')));
const OrderExportDetail = Loadable(lazy(() => import('./features/order/pages/OrderExportDetailPage')));

// 반품 관리 페이지
const OrderReturnList = Loadable(lazy(() => import('./features/order/pages/OrderReturnListPage')));
const OrderReturnDetail = Loadable(lazy(() => import('./features/order/pages/OrderReturnDetailPage')));

// 환불 관리 페이지
const OrderRefundList = Loadable(lazy(() => import('./features/order/pages/OrderRefundListPage')));
const OrderRefundDetail = Loadable(lazy(() => import('./features/order/pages/OrderRefundDetailPage')));

// 출고 티켓 관리 페이지
const OrderExportTicketList = Loadable(lazy(() => import('./features/order/pages/OrderExportTicketListPage')));

// 매출/정산 관리 페이지

const SaleDetails = Loadable(lazy(() => import('./features/sales/pages/SaleDetails')));
const SaleList = Loadable(lazy(() => import('./features/sales/pages/SaleList')));

// 권한 관리 페이지
const ManagerAccount = Loadable(lazy(() => import('./features/roles/pages/ManagerAccountPage')));
const PartnerAccount = Loadable(lazy(() => import('./features/roles/pages/PartnerAccountPage')));
const ManagerAccountDetail = Loadable(lazy(() => import('./features/roles/pages/ManagerAccountDetailPage')));
const PartnerAccountDetail = Loadable(lazy(() => import('./features/roles/pages/PartnerAccountDetailPage')));

// 쇼룸 관리 페이지
const ShowroomListPage = Loadable(lazy(() => import('./features/showroom/pages/ShowroomListPage')));
const ShowroomDetail = Loadable(lazy(() => import('./features/showroom/pages/ShowroomManagementPage')));
const SectionDetail = Loadable(lazy(() => import('./features/showroom/pages/SectionManagementPage')));

// 정산 관리 페이지
const SettlementListPage = Loadable(lazy(() => import('./features/settlement/pages/SettlementListPage')));
const SettlementProviderListPage = Loadable(
  lazy(() => import('./features/settlement/pages/ProviderSettlementListPage')),
);

const RaffleEventListPage = Loadable(lazy(() => import('./features/raffleEvent/pages/RaffleEventListPage')));
const RaffleEventDetailPage = Loadable(lazy(() => import('./features/raffleEvent/pages/RaffleEventDetailPage')));

// 마케팅 관리 페이지

// 기타 관리 페이지

// 데이터 센터 페이지

// 에러 페이지

const AuthorizationRequired = Loadable(lazy(() => import('./pages/AuthorizationRequired')));
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(lazy(() => import('./pages/ServerError')));

// Apps 페이지

const routes: PartialRouteObject[] = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'login-unguarded',
        element: <Login />,
      },
      {
        path: 'password-recovery',
        element: <PasswordRecovery />,
      },
      {
        path: 'password-reset',
        element: <PasswordReset />,
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: 'register-unguarded',
        element: <Register />,
      },
      {
        path: 'verify-code',
        element: <VerifyCode />,
      },
    ],
  },
  /**
   * Story Router
   */
  {
    path: 'content',
    children: [
      {
        path: '/list',
        element: (
          <AuthGuard>
            <OfficeLayout />
          </AuthGuard>
        ),
        children: [
          {
            path: '/',
            element: <ContentList />,
          },
        ],
      },
      {
        path: '/reply/:id',
        element: (
          <AuthGuard>
            <OfficeLayout />
          </AuthGuard>
        ),
        children: [
          {
            path: '/',
            element: <ContentReplyManager />,
          },
        ],
      },
      {
        path: '/builder/:id',
        element: (
          <AuthGuard>
            <OfficeLayout isSidebarHide={true} />
          </AuthGuard>
        ),
        children: [
          {
            path: '/',
            element: <ContentBuilder />,
          },
        ],
      },
    ],
  },
  /**
   * Goods Contents
   * 상품 컨텐츠 보기 (대표, 상세)
   * @description 사이드바 없음
   */
  {
    path: 'goods-content',
    children: [
      {
        path: '/main',
        element: (
          <AuthGuard>
            <OfficeLayout isSidebarHide={true} />
          </AuthGuard>
        ),
        children: [
          {
            path: '/:goodsId',
            element: <GoodsContenList type="main" />,
          },
        ],
      },
      {
        path: '/detail',
        element: (
          <AuthGuard>
            <OfficeLayout isSidebarHide={true} />
          </AuthGuard>
        ),
        children: [
          {
            path: '/:goodsId',
            element: <GoodsContenList type="detail" />,
          },
        ],
      },
    ],
  },
  {
    path: 'logout',
    element: <AccountLogout />,
  },
  /**
   * Default Router
   */
  {
    path: '*',
    element: (
      <AuthGuard>
        <OfficeLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <Account />,
      },
      {
        path: 'account',
        element: <Account />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'showroom',
        children: [
          {
            path: '/',
            element: <ShowroomListPage />,
          },
          {
            path: ':id',
            element: <ShowroomDetail />,
          },
          {
            path: ':id/section',
            element: <SectionDetail />,
          },
          {
            path: ':id/section/:sectionId',
            element: <SectionDetail />,
          },
        ],
      },
      {
        path: 'coupon',
        element: <PermissionGuard pairKey="marketing.coupon" />,
        children: [
          {
            path: '/list',
            element: <CouponList />,
          },
          {
            path: '/create',
            element: <CouponCreate />,
          },
          {
            path: '/:couponId',
            element: <CouponModify />,
          },
        ],
      },
      {
        path: 'raffle-event',
        element: <PermissionGuard pairKey="marketing.live_raffle" />,
        children: [
          {
            path: '/list',
            element: <RaffleEventListPage />,
          },
          {
            path: '/detail/:raffleId',
            element: <RaffleEventDetailPage />,
          },
        ],
      },
      {
        path: 'member',
        children: [
          {
            path: '/',
            element: <MemberManagementListPage />,
          },
          {
            path: '/:userId',
            element: <MemberManagementDetailPage />,
          },
        ],
      },
      {
        path: 'provider',
        element: <PermissionGuard pairKey="provider.provider" />,
        children: [
          {
            path: 'notice',
            element: <ProviderNoticePage />,
          },
          {
            path: 'shipCountry',
            element: <ShippingCountryAddressPage />,
          },
          {
            path: 'list',
            element: <ProviderListPage />,
          },
          {
            path: ':id',
            element: <ProviderDetailPage />,
          },
          {
            path: '*',
            element: <ProviderListPage />,
          },
        ],
      },
      {
        path: 'dormant',
        children: [
          {
            path: '/',
            element: <DormantList />,
          },
          {
            path: ':customerId',
            element: <DormantDetails />,
          },
          {
            path: ':customerId/edit',
            element: <DormantEdit />,
          },
        ],
      },
      {
        path: 'sales',
        children: [
          {
            path: '/',
            element: <SaleList />,
          },
          {
            path: ':invoiceId',
            element: <SaleDetails />,
          },
        ],
      },
      {
        path: 'roles',
        element: <PermissionGuard pairKey="admin" />,
        children: [
          {
            path: '/managers',
            element: (
              <PermissionGuard pairKey="admin.manager">
                <ManagerAccount />
              </PermissionGuard>
            ),
          },
          {
            path: '/managers/:id',
            element: (
              <PermissionGuard pairKey="admin.manager">
                <ManagerAccountDetail />
              </PermissionGuard>
            ),
          },
          {
            path: '/partners',
            element: (
              <PermissionGuard pairKey="admin.partner">
                <PartnerAccount />
              </PermissionGuard>
            ),
          },
          {
            path: '/partners/:id',
            element: (
              <PermissionGuard pairKey="admin.partner">
                <PartnerAccountDetail />
              </PermissionGuard>
            ),
          },
        ],
      },
      {
        path: 'order',
        element: <PermissionGuard pairKey="orders.order" />,
        children: [
          {
            path: '/list',
            element: <OrderList />,
          },
          {
            path: '/detail/:orderId',
            element: <OrderDetail />,
          },
        ],
      },
      {
        path: 'export',
        element: <PermissionGuard pairKey="orders.export" />,
        children: [
          {
            path: '/list',
            element: <OrderExportList />,
          },
          {
            path: '/detail/:exportId',
            element: <OrderExportDetail />,
          },
          {
            path: 'ticket',
            element: <PermissionGuard pairKey="orders.export_ticket" />,
            children: [
              {
                path: '/list',
                element: <OrderExportTicketList />,
              },
            ],
          },
          {
            path: 'prepare',
            element: <PermissionGuard pairKey="orders.export_prepare" />,
            children: [
              {
                path: '/list',
                element: <OrderExportPrepareList />,
              },
            ],
          },
        ],
      },
      {
        path: 'return',
        element: <PermissionGuard pairKey="orders.return" />,
        children: [
          {
            path: '/list',
            element: <OrderReturnList />,
          },
          {
            path: '/detail/:returnId',
            element: <OrderReturnDetail />,
          },
        ],
      },
      {
        path: 'refund',
        element: <PermissionGuard pairKey="orders.refund" />,
        children: [
          {
            path: '/list',
            element: <OrderRefundList />,
          },
          {
            path: '/detail/:refundId',
            element: <OrderRefundDetail />,
          },
        ],
      },
      {
        path: 'ticket',
        element: <PermissionGuard pairKey="orders.export_ticket" />,
        children: [
          {
            path: '/list',
            element: <OrderExportTicketList />,
          },
        ],
      },
      {
        path: 'finance',
        element: <Finance />,
      },
      {
        path: 'goods',
        element: <PermissionGuard pairKey="goods.goods" />,
        children: [
          {
            path: '/',
            element: <GoodsList />,
          },
          {
            path: 'new',
            element: <GoodsCreate />,
          },
          {
            path: ':goodsId',
            element: <GoodsModify />,
          },
        ],
      },
      {
        path: 'bulk',
        element: <PermissionGuard pairKey="goods.bulk" />,
        children: [
          {
            path: '/',
            element: <GoodsBulkList />,
          },
          {
            path: ':bulkId',
            element: <GoodsBulkDetail />,
          },
        ],
      },
      {
        path: 'categories',
        element: <PermissionGuard pairKey="goods.category" />,
        children: [
          {
            path: '/',
            element: <Categories />,
          },
        ],
      },
      {
        path: 'sale-request',
        element: <PermissionGuard pairKey="goods.inspection" />,
        children: [
          {
            path: '/',
            element: <GoodsSaleRequestList />,
          },
        ],
      },
      {
        path: 'brands',
        element: <PermissionGuard pairKey="brand.brand" />,
        children: [
          {
            path: '/',
            element: <BrandListPage />,
          },
          {
            path: ':brandId',
            element: <BrandDetailPage />,
          },
        ],
      },
      {
        path: 'showtime',
        element: <PermissionGuard pairKey="live.live" />,
        children: [
          {
            path: 'contents/list',
            element: <ShowtimeContentsList />,
          },
          {
            path: 'contents/:contentsType/create',
            element: <ShowtimeContentsCreate />,
          },
          {
            path: 'contents/:showTimeId',
            element: <ShowtimeContentsModify />,
          },
          {
            path: 'manage/dashboard/:showTimeId/:pageType',
            element: <ShowtimeManageDashboard />,
          },
          {
            path: 'manage/dashboard/:showTimeId',
            element: <ShowtimeManageDashboard />,
          },
        ],
      },
      {
        path: 'display',
        children: [
          {
            path: 'home',
            element: <PermissionGuard pairKey="display.home" />,
            children: [
              {
                path: 'banner',
                element: <MainBannerList />,
              },
              {
                path: 'banner/:homeBannerId',
                element: <MainBannerDetail />,
              },
              {
                path: 'banner/create',
                element: <MainBannerCreate />,
              },
              {
                path: 'feed',
                element: <MainFeedList />,
              },
              {
                path: 'feed/:homeFeedId',
                element: <MainFeedDetail />,
              },
              {
                path: 'feed/create',
                element: <MainFeedCreate />,
              },
              {
                path: 'shortcut',
                element: <MainShortcutList />,
              },
              {
                path: 'shortcut/:shortcutId',
                element: <MainShortcutModify />,
              },
              {
                path: 'shortcut/create',
                element: <MainShortcutCreate />,
              },
            ],
          },
          {
            path: 'discover',
            element: <PermissionGuard pairKey="display.discovery" />,
            children: [
              {
                path: 'banner/list',
                element: <DiscoverBannerList />,
              },
              {
                path: 'banner/create',
                element: <DiscoverBannerCreate />,
              },
              {
                path: 'banner/:bannerId',
                element: <DiscoverBannerModify />,
              },
              {
                path: 'section/list',
                element: <DiscoverSectionList />,
              },
              {
                path: 'section/:sectionId',
                element: <DiscoverSectionModify />,
              },
              {
                path: 'feed/list',
                element: <DiscoverFeedList />,
              },
              {
                path: 'feed/create',
                element: <DiscoverFeedCreate />,
              },
              {
                path: 'feed/:feedId',
                element: <DiscoverFeedModify />,
              },
              {
                path: 'keyword/list',
                element: <DiscoverKeywordList />,
              },
              {
                path: 'keyword/:keywordId',
                element: <DiscoverKeywordModify />,
              },
            ],
          },
        ],
      },
      {
        path: 'schedule-table',
        element: <PermissionGuard pairKey="display.discovery" />,
        children: [
          {
            path: '/',
            element: <ScheduleTable />,
          },
        ],
      },
      {
        path: 'settlement',
        element: <PermissionGuard pairKey="settlement.settlement" />,
        children: [
          {
            path: '/list',
            element: <SettlementListPage />,
          },
          {
            path: '/provider/list',
            element: <SettlementProviderListPage />,
          },
        ],
      },
      {
        path: '401',
        element: <AuthorizationRequired />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '500',
        element: <ServerError />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
