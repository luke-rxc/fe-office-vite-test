import { TempGoodsInfoResSchema } from '../schemas';

export const detailTempListInfoSchemaMocks: TempGoodsInfoResSchema = {
  id: null,
  name: '임시저장 테스트 Jeff',
  code: '상품코드',
  isDataCollect: true,
  description: '임시저장!',
  brandId: 2,
  brandName: 'nike',
  providerId: 121,
  providerName: 'asdf',
  commissionRate: 100,
  status: 'UNSOLD',
  goodsKind: 'REAL',
  ticket: null,
  requestStatus: 'STANDBY',
  requestId: null,
  partnerExportCode: 'partnerExportCode example',
  feedConfig: {
    facebook: false,
    google: false,
    naver: true,
  },
  searchTags: [
    {
      id: 1,
      value: '검색태그',
    },
  ],
  purchase: {
    userMaxPurchaseLimit: 'LIMIT',
    userMaxPurchaseEa: 3,
    limitedType: 'GOODS',
    limitedGoodsEa: 77,
  },
  shipping: {
    shippingPolicy: 'SHOP',
    shippingMethod: 'PARCEL',
    goodsShippingPolicy: 'UNLIMIT',
    unLimitShippingPrice: 0,
    limitShippingEa: 0,
    limitShippingPrice: 0,
    ifpayCost: 0,
    ifpayFreePrice: 0,
  },
  keyword: [
    {
      id: 1,
      name: '프리즘셀렉션',
    },
    {
      id: 2,
      name: '프리미엄브랜드',
    },
    {
      id: 3,
      name: '슬기로운집콕생활',
    },
    {
      id: 4,
      name: '위드코로나',
    },
  ],
  optionTitles: ['색상', '사이즈'],
  options: [
    {
      id: null,
      goodsId: null,
      sortNumber: 1,
      optionGroup: {
        title1: '색상',
        title2: '사이즈',
        title3: '',
        option1: '화이트',
        option2: 'S',
        option3: '',
      },
      consumerPrice: 0,
      price: 0,
      commissionRate: 100,
      stock: 0,
    },
    {
      id: null,
      goodsId: null,
      sortNumber: 2,
      optionGroup: {
        title1: '색상',
        title2: '사이즈',
        title3: '',
        option1: '화이트',
        option2: 'M',
        option3: '',
      },
      consumerPrice: 0,
      price: 0,
      commissionRate: 100,
      stock: 0,
    },
    {
      id: null,
      goodsId: null,
      sortNumber: 3,
      optionGroup: {
        title1: '색상',
        title2: '사이즈',
        title3: '',
        option1: '화이트',
        option2: 'L',
        option3: '',
      },
      consumerPrice: 0,
      price: 0,
      commissionRate: 100,
      stock: 0,
    },
  ],
  categories: [
    {
      one: {
        id: 5,
        name: '식품/건강',
      },
      two: null,
      three: null,
      primary: false,
    },
  ],
  primaryImage: {
    id: 640,
    path: 'goods/20210927/8558a6d0-f96a-4372-b808-b1b4b14e532f',
    extension: 'jpeg',
    width: 1200,
    height: 1200,
  },
  files: [
    {
      file: {
        id: 10171,
        path: 'goods/20211018/11cd6943-2e5f-4f6d-98ae-7bbf23ea1201.png',
        extension: 'png',
        width: 1560,
        height: 1168,
      },
      videoPlayType: null,
    },
    {
      file: {
        id: 10172,
        path: 'goods/20211018/6ffe4e3a-8249-4683-aaca-6dcfd09445aa.mp4',
        extension: 'mp4',
        width: 0,
        height: 0,
      },
      videoPlayType: 'ONCE',
    },
  ],
  components: null,
  informationList: [
    {
      id: null,
      title: '1. 품명 및 모델명',
      contents: '상품상세페이지 참조',
      sortNumber: 1,
    },
    {
      id: null,
      title: '2. 재질',
      contents: '상품상세페이지 참조 WOW!',
      sortNumber: 2,
    },
    {
      id: null,
      title: '3. 구성품',
      contents: '상품상세페이지 참조',
      sortNumber: 3,
    },
    {
      id: null,
      title: '4. 크기',
      contents: '상품상세페이지 참조',
      sortNumber: 4,
    },
    {
      id: null,
      title: '5. 동일모델의 출시년월',
      contents: '상품상세페이지 참조',
      sortNumber: 5,
    },
    {
      id: null,
      title: '6. 제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능)',
      contents: '상품상세페이지 참조',
      sortNumber: 6,
    },
    {
      id: null,
      title: '7. 제조국',
      contents: '상품상세페이지 참조',
      sortNumber: 7,
    },
    {
      id: null,
      title:
        '8. 수입식품안전관리특별법에 따른 수입 기구·용기의 경우 “수입식품안전관리특별법에 따른 수입신고를 필함”의 문구',
      contents: '상품상세페이지 참조',
      sortNumber: 8,
    },
    {
      id: null,
      title: '9. 품질보증기준',
      contents: '상품상세페이지 참조',
      sortNumber: 9,
    },
    {
      id: null,
      title: '10. A/S 책임자와 전화번호',
      contents: '상품상세페이지 참조',
      sortNumber: 10,
    },
  ],
  deliveryPolicy: {
    deliveryExportingDelays: 0,
    deliveryTodayEndTime: '12:00',
  },
  displayPeriod: {
    salesStartDate: 1631797377000,
    salesEndDate: null,
    displayStartDate: 1631797377000,
  },
  adminUserId: 210,
  adminMdId: 99,
  adminGoodsManagerId: null,
  goodsType: 'PREORDER',
  providerShippingId: 29,
  optionBases: [
    {
      title: '색상',
      value: '화이트',
    },
    {
      title: '사이즈',
      value: 'S, M, L',
    },
  ],
  isOptionUse: true,
  isAdultRequired: false,
  isPrizmOnly: false,
  isUseCoupon: true,
  isPcccRequired: false,
  isCancelable: true,
  kcFileList: [
    {
      id: 1,
      path: 'brand/2021/05/21/7225e89f-38d9-43bf-a40a-1c56d454c5fc',
      originalFileName: '111.png',
      extension: 'png',
      width: 200,
      height: 300,
      fileSize: 2907756,
      fileType: 'IMAGE',
    },
    {
      id: 2,
      path: 'goods/2021/05/21/efd10af6-733a-448e-b73c-4374cbcb0b06',
      originalFileName: '111.png',
      extension: 'png',
      width: 100,
      height: 200,
      fileSize: 2907756,
      fileType: 'IMAGE',
    },
    {
      id: 3,
      path: 'goods/2021/05/21/4d38fc60-d7cd-4ee0-8feb-45ec2d1f2a34',
      originalFileName: '111.png',
      extension: 'png',
      width: 100,
      height: 200,
      fileSize: 2907756,
      fileType: 'IMAGE',
    },
  ],
  certificationList: [
    {
      id: 1,
      path: 'brand/2021/05/21/7225e89f-38d9-43bf-a40a-1c56d454c5fc',
      originalFileName: '111.png',
      extension: 'png',
      width: 200,
      height: 300,
      fileSize: 2907756,
      fileType: 'IMAGE',
    },
    {
      id: 2,
      path: 'goods/2021/05/21/efd10af6-733a-448e-b73c-4374cbcb0b06',
      originalFileName: '111.png',
      extension: 'png',
      width: 100,
      height: 200,
      fileSize: 2907756,
      fileType: 'IMAGE',
    },
    {
      id: 3,
      path: 'goods/2021/05/21/4d38fc60-d7cd-4ee0-8feb-45ec2d1f2a34',
      originalFileName: '111.png',
      extension: 'png',
      width: 100,
      height: 200,
      fileSize: 2907756,
      fileType: 'IMAGE',
    },
  ],
  settlementKind: 'COMMISSION',
  vatCode: null,
};
