import { GoodsStatus } from '@constants/goods';
import { GoodsRequestStatus } from './goodsCommon';

// 섹션 타이틀의 width 값
export const ListTitleWidth = 120;

// 카테고리 Value-key
export const CategoryFieldKeys = ['category1', 'category2', 'category3'];

// Excel Export Header
export const ExcelExportListHeader = [
  '상품 ID',
  '상품명',
  '상품유형',
  '상품분류',
  '판매상태',
  '입점사',
  '키워드',
  '시작일',
  '종료일',
];

// 판매기간 기준
export const DateType = {
  START: 'START',
  END: 'END',
  CREATE: 'CREATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DateType = keyof typeof DateType;

const DateTypeLabel: {
  [k in DateType]: string;
} = {
  START: '판매시작일',
  END: '판매종료일',
  CREATE: '등록일',
};

export const DateTypeOptions = [
  { label: DateTypeLabel.START, value: DateType.START },
  { label: DateTypeLabel.END, value: DateType.END },
  { label: DateTypeLabel.CREATE, value: DateType.CREATE },
];

// 상품 조회 > 판매 상태 Checkbox
export const SaleStatusCbOptions = [GoodsStatus.NORMAL, GoodsStatus.UNSOLD, GoodsStatus.RUNOUT];

// 파트너 상품 조회 > 승인 상태 Checkbox
export const RequestStatusCbOptions = [
  GoodsRequestStatus.STANDBY,
  GoodsRequestStatus.SALE_REQUEST,
  GoodsRequestStatus.CHANGE_REQUEST,
  GoodsRequestStatus.REJECT,
  GoodsRequestStatus.APPROVAL,
];

// 상품조회시 기본 Page Set
export const ListPageSet = {
  page: 1,
  size: 10,
} as const;

/** Message : Manager & Partner 공통 */
export const CommonListMessage = {
  FAIL_SEARCH_LIST: '리스트 검색이 실패하였습니다.\r\n다시 한번 시도해 주세요',
  FAIL_DELETE_LIST: '삭제가 실패하였습니다.\r\n다시 한번 시도해 주세요',
  SUCCESS_DELETE_LIST: '삭제가 완료되었습니다',
  VALID_DELETE_LIST: {
    NOTHING: '삭제할 상품을 선택해주세요',
    ONCE: '한개의 상품만 삭제할 수 있습니다',
  },
  FAIL_DUPLICATE_LIST: '복제가 실패하였습니다.\r\n다시 한번 시도해 주세요',
  FAIL_EXPORT_LIST: '엑셀파일 다운로드에 실패하였습니다. 잠시 후 다시 한번 시도해 주세요',
  SUCCESS_DUPLICATE_LIST: '복제가 완료되었습니다',
  VALID_DUPLICATE: {
    NOTHING: '복제할 상품을 한개 선택해주세요',
    ONCE: '한개의 상품만 복제할 수 있습니다',
  },
};

/** Message : Manager */
export const ManagerListMessage = {
  VALID_DUPLICATE: {
    GOODS_KIND: '실물 또는 티켓_일반 상품만 복제할수 있습니다',
  },
  VALID_EXPORT_BULK: {
    GOODS_KIND: '티켓_연동 상품들은 서식 다운로드가 불가능합니다',
  },
  FAIL_EXPORT_BULK: '일괄 업로드 서식 다운로드에 실패하였습니다. 잠시 후 다시 한번 시도해 주세요',
  REQUIRED_EXPORT_BULK: '상품명, 상품아이디, 브랜드, 입점사\r\n검색조건 중 1가지 이상을 입력해주세요',
};

/** Message : Partner */
export const PartnerListMessage = {
  VALID_SALE_REQUEST: {
    NOTHING: '승인요청할 상품을 선택해주세요',
  },
};
