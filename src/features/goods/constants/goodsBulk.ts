/** 일괄수정 서식 */
export const BulkType = {
  /** 기본정보 */
  BASE: 'BASE',
  /** 키워드/담당자정보 */
  MAPPING: 'MAPPING',
  /** 옵션정보 */
  OPTION: 'OPTION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BulkType = typeof BulkType[keyof typeof BulkType];

export const BulkTypeLabel: {
  [k in BulkType]: string;
} = {
  BASE: '기본정보',
  MAPPING: '키워드/담당자정보',
  OPTION: '옵션정보',
};

// 상품분류 Select
export const BulkTypeOptions = [
  { label: BulkTypeLabel.BASE, value: BulkType.BASE },
  { label: BulkTypeLabel.MAPPING, value: BulkType.MAPPING },
  { label: BulkTypeLabel.OPTION, value: BulkType.OPTION },
];

/** Bulk > 검색 타입 */
export const BulkSearchType = {
  TITLE: 'TITLE',
  GOODS: 'GOODS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BulkSearchType = typeof BulkSearchType[keyof typeof BulkSearchType];

export const BulkSearchTypeLabel: {
  [k in BulkSearchType]: string;
} = {
  TITLE: '처리사유',
  GOODS: '상품번호',
};

// 상품분류 Radio
export const BulkSearchTypeOptions = [
  { label: BulkSearchTypeLabel.TITLE, value: BulkSearchType.TITLE },
  { label: BulkSearchTypeLabel.GOODS, value: BulkSearchType.GOODS },
];

/** Bulk > 처리 타입 */
export const BulkStatusType = {
  STANDBY: 'STANDBY',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BulkStatusType = keyof typeof BulkStatusType;

export const BulkStatusTypeLabel: {
  [k in BulkStatusType]: string;
} = {
  STANDBY: '대기',
  COMPLETE: '완료',
  ERROR: '실패',
};

export const BulkStatusTypeCbOptions = [BulkStatusType.STANDBY, BulkStatusType.COMPLETE, BulkStatusType.ERROR];

// 업로드 Modal > 일괄업로드 예약
export const BulkReservationType = {
  DIRECT: 'DIRECT',
  RESERVATION: 'RESERVATION',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BulkReservationType = keyof typeof BulkReservationType;

export const BulkReservationTypeLabel: {
  [k in BulkReservationType]: string;
} = {
  DIRECT: '즉시',
  RESERVATION: '예약',
};

export const BulkReservationOptions = [
  { label: BulkReservationTypeLabel.DIRECT, value: BulkReservationType.DIRECT },
  { label: BulkReservationTypeLabel.RESERVATION, value: BulkReservationType.RESERVATION },
];

/** Message : Bulk */
export const BulkMessage = {
  FAIL_LOAD_HEADER: '일괄 업르드 기본 정보(헤더)를 불러오는데 실패했습니다',
  FAIL_UPLOAD_TYPE: '일괄 수정 처리할 항목이 없습니다.\r\n업로드한 엑셀 내용을 확인해주세요',
  FAIL_UPLOAD_VALIDATE: {
    POSITIVE: '양수만 가능합니다',
    MIN_PRICE: '100원 이상이여야 합니다',
    UNIT_PRICE: '10원 단위로 입력해주세요',
  },
};

/** 일괄 업로드 오류시 노출할 최대갯수 */
export const BulkExportErrorLimit = 20;

/**
 * 일괄 업로드시 기본 노출되는 Key
 */
export const BulkAutoGenerateKeys = ['goodsId', 'name', 'option', 'optionId'];
