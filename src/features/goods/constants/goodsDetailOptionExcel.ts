/**
 * 엑셀 업로드 타입
 */
export const OptExcelUploadType = {
  // 일반 배송 상품 전부, 티켓 상품 내 숙박권을 제외한 모든 상품
  BASE: 'BASE',
  // 티켓 상품 기본
  TICKET_BASE: 'TICKET_BASE',
  // 티켓 상품 내 숙박권 + 날짜 지정
  TICKET_BOOK_DATED: 'TICKET_BOOK_DATED',
  // 티켓 상품 내 숙박권 + 날짜 미지정
  TICKET_BOOK_UNDATED: 'TICKET_BOOK_UNDATED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptExcelUploadType = ValueOf<typeof OptExcelUploadType>;

/** @todo type Refactoring */
/* const OptExcelSheetCodeName = {
  id: '관리코드',
  consumerPrice: '정상가',
  price: '판매가',
  discountRate: '할인율',
  stock: '재고수량',
  commissionRate: '수수료',
  ticketGoodsId: '티켓상품ID',
  bookingDate: '날짜',
  depositPrice: '입금가',
};

const getOptExcelSheetCodeName = (...fieldNames: string[]) => {
  return fieldNames.reduce((current, fieldName) => {
    return {
      ...current,
      [fieldName]: OptExcelSheetCodeName[fieldName],
    };
  }, {});
}; */

/** Excel Download SheetName(Header)  */
export const ExcelDownloadSheetName = {
  id: '관리코드',
  consumerPrice: '정상가',
  price: '판매가',
  stock: '재고수량',
  commissionRate: '수수료',
  ticketGoodsId: '티켓상품ID',
  bookingDate: '날짜',
  depositPrice: '입금가',
};

/** Excel Download Sheet Default Value  */
const ExcelDownloadSheetDefaultValue: Record<keyof typeof ExcelDownloadSheetName, any> = {
  id: '',
  consumerPrice: 0,
  price: 0,
  stock: 0,
  commissionRate: 0,
  ticketGoodsId: '',
  bookingDate: '221009',
  depositPrice: 0,
};

const { id, consumerPrice, price, stock, commissionRate, ticketGoodsId, bookingDate, depositPrice } =
  ExcelDownloadSheetName;

/**
 * Option Excel SheetCode
 */
export const OptExcelSheetCode = {
  // base (일반 배송 상품)
  [OptExcelUploadType.BASE]: {
    id,
    consumerPrice,
    price,
    stock,
    commissionRate,
  },
  [OptExcelUploadType.TICKET_BASE]: {
    id,
    consumerPrice,
    price,
    stock,
    commissionRate,
    ticketGoodsId,
  },
  [OptExcelUploadType.TICKET_BOOK_DATED]: {
    id,
    bookingDate,
    consumerPrice,
    price,
    depositPrice,
    stock,
    commissionRate,
    ticketGoodsId,
  },
  [OptExcelUploadType.TICKET_BOOK_UNDATED]: {
    id,
    bookingDate,
    consumerPrice,
    price,
    depositPrice,
    stock,
    commissionRate,
    ticketGoodsId,
  },
};

// Excel 내 Option 포맷
const ExcelDownloadFormOption = {
  opt1_옵션명1: '옵션값1',
  opt2_옵션명2: '옵션값2',
  opt3_옵션명3: '옵션값3',
} as const;

// Excel Download 시 기본 서식
export const ExcelDownloadForm = {
  [OptExcelUploadType.BASE]: {
    [ExcelDownloadSheetName.id]: ExcelDownloadSheetDefaultValue.id,
    ...ExcelDownloadFormOption,
    [ExcelDownloadSheetName.consumerPrice]: ExcelDownloadSheetDefaultValue.consumerPrice,
    [ExcelDownloadSheetName.price]: ExcelDownloadSheetDefaultValue.price,
    [ExcelDownloadSheetName.stock]: ExcelDownloadSheetDefaultValue.stock,
    [ExcelDownloadSheetName.commissionRate]: ExcelDownloadSheetDefaultValue.commissionRate,
  },
  [OptExcelUploadType.TICKET_BASE]: {
    [ExcelDownloadSheetName.id]: ExcelDownloadSheetDefaultValue.id,
    ...ExcelDownloadFormOption,
    [ExcelDownloadSheetName.consumerPrice]: ExcelDownloadSheetDefaultValue.consumerPrice,
    [ExcelDownloadSheetName.price]: ExcelDownloadSheetDefaultValue.price,
    [ExcelDownloadSheetName.stock]: ExcelDownloadSheetDefaultValue.stock,
    [ExcelDownloadSheetName.commissionRate]: ExcelDownloadSheetDefaultValue.commissionRate,
    [ExcelDownloadSheetName.ticketGoodsId]: ExcelDownloadSheetDefaultValue.ticketGoodsId,
  },
  [OptExcelUploadType.TICKET_BOOK_DATED]: {
    [ExcelDownloadSheetName.id]: ExcelDownloadSheetDefaultValue.id,
    [ExcelDownloadSheetName.bookingDate]: ExcelDownloadSheetDefaultValue.bookingDate,
    ...ExcelDownloadFormOption,
    [ExcelDownloadSheetName.consumerPrice]: ExcelDownloadSheetDefaultValue.consumerPrice,
    [ExcelDownloadSheetName.price]: ExcelDownloadSheetDefaultValue.price,
    [ExcelDownloadSheetName.depositPrice]: ExcelDownloadSheetDefaultValue.depositPrice,
    [ExcelDownloadSheetName.stock]: ExcelDownloadSheetDefaultValue.stock,
    [ExcelDownloadSheetName.commissionRate]: ExcelDownloadSheetDefaultValue.commissionRate,
    [ExcelDownloadSheetName.ticketGoodsId]: ExcelDownloadSheetDefaultValue.ticketGoodsId,
  },
  [OptExcelUploadType.TICKET_BOOK_UNDATED]: {
    [ExcelDownloadSheetName.id]: ExcelDownloadSheetDefaultValue.id,
    ...ExcelDownloadFormOption,
    [ExcelDownloadSheetName.consumerPrice]: ExcelDownloadSheetDefaultValue.consumerPrice,
    [ExcelDownloadSheetName.price]: ExcelDownloadSheetDefaultValue.price,
    [ExcelDownloadSheetName.depositPrice]: ExcelDownloadSheetDefaultValue.depositPrice,
    [ExcelDownloadSheetName.stock]: ExcelDownloadSheetDefaultValue.stock,
    [ExcelDownloadSheetName.commissionRate]: ExcelDownloadSheetDefaultValue.commissionRate,
    [ExcelDownloadSheetName.ticketGoodsId]: ExcelDownloadSheetDefaultValue.ticketGoodsId,
  },
} as const;

export const ExcelUploadErrorQueueType = {
  OPTION: '옵션정보 입력이 잘못되어 업로드를 진행할 수 없습니다.',
} as const;
