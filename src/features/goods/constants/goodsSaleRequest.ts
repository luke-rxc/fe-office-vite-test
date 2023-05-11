export const SaleRequestType = {
  SALE: 'SALE',
  MODIFY: 'MODIFY',
  REJECT: 'REJECT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SaleRequestType = typeof SaleRequestType[keyof typeof SaleRequestType];

export const SaleRequestTypeLabel: {
  [k in SaleRequestType]: string;
} = {
  SALE: '승인요청',
  MODIFY: '수정요청',
  REJECT: '반려',
};

export const SaleRequestTabs = [
  {
    label: SaleRequestTypeLabel.SALE,
    value: SaleRequestType.SALE,
  },
  {
    label: SaleRequestTypeLabel.MODIFY,
    value: SaleRequestType.MODIFY,
  },
  {
    label: SaleRequestTypeLabel.REJECT,
    value: SaleRequestType.REJECT,
  },
];

/** Message : 상품 검수 */
export const SaleRequestMessage = {
  CONFIRM_SALE_REQUEST: {
    title: '승인 요청 하시겠습니까?',
    message:
      '승인 요청 후 상품 수정은 불가합니다.\r\n정확하지 않은 정보는 반려의 사유가 될 수 있습니다.\r\n승인 완료 후 지정한 전시 및 판매일부터 해당 상품이 노출 및 판매됩니다',
  },
  VALID_APPROVAL: {
    NOTHING: '승인하려는 항목을 한개 이상 선택해주세요',
    SYSTEM: '시스템 오류입니다. 담당자에게 문의해 주세요(requestId 값 null)',
  },
  VALID_REJECT: {
    NOTHING: '반려하려는 항목을 한개 이상 선택해주세요',
    MEMO: '메모를 입력해주세요',
    SYSTEM: '시스템 오류입니다. 담당자에게 문의해 주세요(requestId 값 null)',
  },
  FAIL_SEARCH_LIST: '리스트 검색이 실패하였습니다.\r\n다시 한번 시도해 주세요',
  /** @description SaleRequestDialog component */
  DIALOG: {
    // 수정사유 Dialog Placeholder
    MODIFY: {
      TITLE: '수정사유를 입력해주세요',
      PLACEHOLDER: `옵션 가격 변경\r\n옵션 삭제`,
      DESCRIPTION: `[판매기간, 1인 최대구매수량, 옵션 가격] 수정 시 매니저 승인 후\r\n서비스에 반영됩니다`,
    },
    // 반려사유 Dialog Placeholder
    REJECT: {
      TITLE: '반려사유를 입력해주세요',
      PLACEHOLDER: `[썸네일 이미지] 해상도 낮음\r\n[판매가] 재확인\r\n[상품 설명] 오타 확인`,
    },
  },
};
