/**
 * 쇼타임 콘텐츠 리스트 조회 query key
 */
export const showtimeContentsListQueryKey = 'showtime/contents/list';

/**
 * 쇼타임 콘텐츠 상세 조회 query key
 */
export const showtimeContentsItemQueryKey = 'showtime/contents/item';

/**
 * 쇼타임 경매목록 조회 query key
 */
export const showtimeAuctionItemsQueryKey = 'showtime/auction/items';

/**
 * 쇼타임 채팅 채널 query key
 */
export const showtimeChatChannelQueryKey = 'showtime/chat/channel';

/**
 * 쇼타임 라이브 채널 query key
 */
export const showtimeLiveChannelQueryKey = 'showtime/live/channel';

/**
 * 쇼타임 앵커포인트 편성 리스트 query key
 */
export const showtimeAnchorPointItemsQueryKey = 'showtime/anchor-point/items';
/**
 * 쇼타임 연결된 상품 리스트 query key
 */
export const showtimeLinkedGoodsItemsQueryKey = 'showtime/linked-goods/items';
/**
 * 쇼타임 라이브 채널 query key
 */
export const showtimeLiveChannelCreateQueryKey = 'showtime/live/channel/create';
/**
 * 검색필터에 쇼룸 검색 가능 개수
 */
export const limitSearchShowroomCount = 5;
/**
 * 라이브 공지메세지 저장 key
 */
export const saveNoticeMessageKey = 'live_message';
/**
 * 라이브 공지메세지 저장 가능 개수
 */
export const saveNoticeMessageMaxCount = 10;

export const ShowtimeRaffleEventQueryKeys = {
  all: [{ scope: 'showtime-manage-raffle-event' }] as const,
  lists: () => [{ ...ShowtimeRaffleEventQueryKeys.all[0], entity: 'list' }] as const,
  list: (showTimeId: number) => [{ ...ShowtimeRaffleEventQueryKeys.lists()[0], showTimeId }] as const,
  detail: (showTimeId: number, raffleId: number) =>
    [{ ...ShowtimeRaffleEventQueryKeys.all[0], entity: 'detail', showTimeId, raffleId }] as const,
} as const;

/**
 * 검색 더보기
 */
export const SearchFilterMore = {
  ALL: 'ALL',
  REQUIRED: 'REQUIRED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SearchFilterMore = typeof SearchFilterMore[keyof typeof SearchFilterMore];

export const SearchFilterMoreLabel: {
  [k in SearchFilterMore]: string;
} = {
  ALL: '필터 모두보기',
  REQUIRED: '필터 숨기기',
};

/**
 * 검색조건
 */
export const SearchField = {
  CONTENTS_ID: 'CONTENTS_ID',
  GOODS_ID: 'GOODS_ID',
  GOODS_NAME: 'GOODS_NAME',
  TITLE: 'TITLE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SearchField = typeof SearchField[keyof typeof SearchField];

export const SearchFieldLabel: {
  [k in SearchField]: string;
} = {
  CONTENTS_ID: '콘텐츠 번호',
  GOODS_ID: '상품번호',
  GOODS_NAME: '상품명',
  TITLE: '제목',
};

/**
 * 검색타입
 */
export const ContentsType = {
  AUCTION: 'AUCTION',
  STANDARD: 'STANDARD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentsType = typeof ContentsType[keyof typeof ContentsType];

export const ContentsTypeLabel: {
  [k in ContentsType]: string;
} = {
  AUCTION: '경매',
  STANDARD: '일반',
};

/**
 * 라이브 상태
 */
export const LiveStatus = {
  NONE: 'NONE',
  STANDBY: 'STANDBY',
  READY: 'READY',
  REPLAY: 'REPLAY',
  CREATING: 'CREATING',
  END: 'END',
  LIVE: 'LIVE',
  REHEARSAL: 'REHEARSAL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveStatus = typeof LiveStatus[keyof typeof LiveStatus];

export const LiveStatusLabel: {
  [k in LiveStatus]: string;
} = {
  NONE: 'None',
  STANDBY: 'Standby',
  READY: 'Ready',
  REPLAY: 'Replay',
  CREATING: 'Creating',
  END: 'Done',
  LIVE: 'Live',
  REHEARSAL: 'Rehearsal',
};

export const LiveStatusMessage: {
  [k in LiveStatus]: string;
} = {
  NONE: '라이브를 시작하시려면 스트림을 생성해주세요',
  STANDBY: '스트림이 생성되면 송출을 시작해주세요.',
  READY: '준비가 끝났습니다. ON AIR 버튼을 눌러 시작해주세요',
  REPLAY: 'Replay',
  CREATING: 'Creating',
  END: '생방송이 종료되었습니다.',
  LIVE: '생방송 중입니다.',
  REHEARSAL: 'Rehearsal',
};

/**
 * 공개 상태
 */
export const OpenStatus = {
  DRAFT: 'DRAFT',
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OpenStatus = typeof OpenStatus[keyof typeof OpenStatus];

export const OpenStatusLabel: {
  [k in OpenStatus]: string;
} = {
  DRAFT: '비공개',
  PRIVATE: '관리자 공개',
  PUBLIC: '공개',
};

/**
 * 경매 업로드 타입
 */
export const AuctionUploadType = {
  PRIMARY: 'PRIMARY',
  GOODS: 'GOODS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuctionUploadType = typeof AuctionUploadType[keyof typeof AuctionUploadType];

/**
 * 모달 타입
 */
export const ModalType = {
  CREATE: 'CREATE',
  MODIFY: 'MODIFY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ModalType = typeof ModalType[keyof typeof ModalType];

/**
 * 경매 모달타입 라벨
 */
export const AuctionModalTypeLabel: {
  [k in ModalType]: string;
} = {
  CREATE: '경매 상품 등록',
  MODIFY: '경매 상품 수정',
};

/**
 * 앵커포인트 모달타입 라벨
 */
export const AnchorPointModalTypeLabel: {
  [k in ModalType]: string;
} = {
  CREATE: '앵커포인트 등록',
  MODIFY: '앵커포인트 수정',
};

/**
 * 라이브 상태 옵션
 */
export const liveStatusOptions: Array<LiveStatus> = [
  LiveStatus.NONE,
  LiveStatus.STANDBY,
  LiveStatus.READY,
  LiveStatus.LIVE,
  LiveStatus.END,
  LiveStatus.REPLAY,
];

/**
 * 공개 상태 옵션
 */
export const openStatusOptions: Array<OpenStatus> = [OpenStatus.PRIVATE, OpenStatus.DRAFT, OpenStatus.PUBLIC];

/**
 * 경매상태
 */
export const AuctionStatus = {
  BLOCKED_WAITING: 'BLOCKED_WAITING',
  WAITING: 'WAITING',
  OPENING: 'OPENING',
  BIDDING: 'BIDDING',
  COUNTDOWN: 'COUNTDOWN',
  PAUSE: 'PAUSE',
  SUCCESSFUL_BID: 'SUCCESSFUL_BID',
  CANCEL: 'CANCEL',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuctionStatus = typeof AuctionStatus[keyof typeof AuctionStatus];

/**
 * 경매상태 라벨
 */
export const AuctionStatusLabel: {
  [k in AuctionStatus]: string;
} = {
  BLOCKED_WAITING: '경매 대기',
  WAITING: '경매 가능',
  OPENING: '경매 가능',
  BIDDING: '경매중',
  COUNTDOWN: '경매중',
  PAUSE: '경매중',
  SUCCESSFUL_BID: '경매 완료',
  CANCEL: '경매 취소',
};

/**
 * 경매상태 메세지
 */
export const AuctionStatusMessage: {
  [k in AuctionStatus]: string;
} = {
  BLOCKED_WAITING: '경매를 진행 할 수 없습니다.',
  WAITING: '경매를 진행 할 수 있습니다.',
  OPENING: '입찰을 시작 할 수 있습니다.',
  BIDDING: '입찰이 진행중입니다.',
  COUNTDOWN: '최종 입찰 카운트다운이 진행중입니다.',
  PAUSE: '입찰이 일시중지 되었습니다.',
  SUCCESSFUL_BID: '경매가 종료되었습니다.',
  CANCEL: '경매가 취소되었습니다.',
};

/**
 * 경매 요청상태
 */
export const AuctionRequestStatus = {
  OPENING: 'OPENING',
  START_BIDDING: 'START_BIDDING',
  CANCEL_AUCTION: 'CANCEL_AUCTION',
  PAUSE_BIDDING: 'PAUSE_BIDDING',
  RESUME_BIDDING: 'RESUME_BIDDING',
  COUNTDOWN: 'COUNTDOWN',
  SUCCESSFUL_BID: 'SUCCESSFUL_BID',
  CHANGE_UNIT_PRICE: 'CHANGE_UNIT_PRICE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuctionRequestStatus = typeof AuctionRequestStatus[keyof typeof AuctionRequestStatus];

export const AuctionRequestStatusLabel: {
  [k in AuctionRequestStatus]: string;
} = {
  OPENING: '경매 상품 공개',
  START_BIDDING: '입찰 시작',
  CANCEL_AUCTION: '경매 취소',
  PAUSE_BIDDING: '입찰 일시정지',
  RESUME_BIDDING: '입찰 재개',
  COUNTDOWN: '최종 입찰 카운트다운',
  SUCCESSFUL_BID: '즉시 낙찰하기 (경매 종료)',
  CHANGE_UNIT_PRICE: '입찰 설정 변경',
};

/**
 * 경매 요청상태 메세지
 */
export const AuctionRequestStatusMessage: {
  [k in AuctionRequestStatus]: string;
} = {
  OPENING: '경매상품을 공개하시겠습니까?',
  START_BIDDING: '입찰을 시작하시겠습니까?',
  CANCEL_AUCTION: '경매를 취소하시겠습니까?\r\n기존 입찰은 모두 무효처리 됩니다.',
  PAUSE_BIDDING: '입찰을 일시정지하시겠습니까?',
  RESUME_BIDDING: '입찰을 재개하시겠습니까?',
  COUNTDOWN: '최종 입찰 카운트다운을 시작하시겠습니까?\r\n카운트다운이 종료되면 자동 낙찰됩니다.',
  SUCCESSFUL_BID: '현재 입찰가로 낙찰하시겠습니까?',
  CHANGE_UNIT_PRICE: '변경된 내용을 저장하시겠습니까?',
};

/**
 * 경매 요청상태 완료 메세지
 */
export const AuctionRequestStatusCompleteMessage: {
  [k in AuctionRequestStatus]: string;
} = {
  OPENING: '경매상품이 공개처리 되었습니다.',
  START_BIDDING: '입찰이 시작되었습니다.',
  CANCEL_AUCTION: '경매가 취소되었습니다.',
  PAUSE_BIDDING: '입찰이 일시정지되었습니다.',
  RESUME_BIDDING: '입찰이 재개되었습니다.',
  COUNTDOWN: '최종 입찰 카운트다운이 시작되었습니다.',
  SUCCESSFUL_BID: '현재 입찰가로 낙찰처리되었습니다.',
  CHANGE_UNIT_PRICE: '입찰 설정이 변경되었습니다.',
};

/**
 * 쇼타임 운영 page type
 */
export const ManagePageType = {
  CHAT: 'CHAT',
  CHAT_MONITORING: 'CHAT_MONITORING',
  CONTROL_BOARD: 'CONTROL_BOARD',
  ANCHOR_POINT: 'ANCHOR_POINT',
  AUCTION: 'AUCTION',
  STATISTICS: 'STATISTICS',
  RAFFLE_EVENT: 'RAFFLE_EVENT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ManagePageType = typeof ManagePageType[keyof typeof ManagePageType];

export const ManagePageTypeLabel: {
  [k in ManagePageType]: string;
} = {
  CHAT: '채팅방 관리',
  CHAT_MONITORING: '채팅 모니터링',
  CONTROL_BOARD: '컨트롤보드',
  ANCHOR_POINT: '앵커포인트',
  AUCTION: '경매관리',
  STATISTICS: '통계',
  RAFFLE_EVENT: '이벤트관리',
};

/**
 * 라이브채널 type
 */
export const LiveChannelType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveChannelType = typeof LiveChannelType[keyof typeof LiveChannelType];

/**
 * Broadcast type
 */
export const BroadcastType = {
  REHEARSAL: 'REHEARSAL',
  ON_AIR: 'ON_AIR',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BroadcastType = typeof BroadcastType[keyof typeof BroadcastType];

export const BroadcastTypeLabel: {
  [k in BroadcastType]: string;
} = {
  REHEARSAL: '리허설',
  ON_AIR: '본방송',
};

/**
 * Broadcast action type
 */
export const BroadcastActionType = {
  REHEARSAL: 'REHEARSAL',
  ON_AIR: 'ON_AIR',
  FINISH_REHEARSAL: 'FINISH_REHEARSAL',
  CANCEL_STREAM: 'CANCEL_STREAM',
  START_ON_AIR: 'START_ON_AIR',
  FINISH_ON_AIR: 'FINISH_ON_AIR',
  CHANGE_STREAM: 'CHANGE_STREAM',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type BroadcastActionType = typeof BroadcastActionType[keyof typeof BroadcastActionType];

export const BroadcastActionTypeLabel: {
  [k in BroadcastActionType]: string;
} = {
  REHEARSAL: '스트림 생성',
  ON_AIR: '스트림 생성',
  FINISH_REHEARSAL: '리허설 종료',
  CANCEL_STREAM: '스트림 취소',
  START_ON_AIR: 'ON AIR',
  FINISH_ON_AIR: '본방송 종료',
  CHANGE_STREAM: '스트림 교체',
};

/**
 * 스트림 상태
 */
export const StreamStatus = {
  NONE: 'NONE',
  STANDBY: 'STANDBY',
  WAITING: 'WAITING',
  PROCESSING: 'PROCESSING',
  DISCONNECTED: 'DISCONNECTED',
  FINISHED: 'FINISHED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type StreamStatus = typeof StreamStatus[keyof typeof StreamStatus];

export const StreamStatusMessage: {
  [k in StreamStatus]: string;
} = {
  NONE: '스트림이 없습니다.',
  STANDBY: '스트림을 생성하고 있습니다.',
  WAITING: '송출을 기다리고 있습니다.',
  PROCESSING: '정상적으로 송출 중입니다.',
  DISCONNECTED: '송출 연결이 끊어졌습니다.',
  FINISHED: '스트림이 종료되었습니다',
};

/**
 * 라이브 상태
 */
export const RehearsalStatus = {
  NONE: 'NONE',
  CREATING: 'CREATING',
  REHEARSAL: 'REHEARSAL',
  END: 'END',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RehearsalStatus = typeof RehearsalStatus[keyof typeof RehearsalStatus];

export const RehearsalStatusLabel: {
  [k in RehearsalStatus]: string;
} = {
  NONE: 'None',
  CREATING: 'Creating',
  REHEARSAL: 'Rehearsal',
  END: 'Done',
};

export const RehearsalStatusMessage: {
  [k in RehearsalStatus]: string;
} = {
  NONE: '라이브를 시작하시려면 스트림을 생성해주세요',
  CREATING: '라이브를 시작하시려면 스트림을 생성해주세요',
  REHEARSAL: '라이브를 시작하시려면 스트림을 생성해주세요',
  END: '라이브를 시작하시려면 스트림을 생성해주세요',
};

/**
 * 앵커포인트 image type
 */
export const AnchorPointImageType = {
  GOODS: 'GOODS',
  UPLOAD: 'UPLOAD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AnchorPointImageType = typeof AnchorPointImageType[keyof typeof AnchorPointImageType];

export const AnchorPointImageTypeLabel: {
  [k in AnchorPointImageType]: string;
} = {
  GOODS: '상품연동',
  UPLOAD: '직접 업로드',
};

/**
 * 앵커포인트 액션타입
 */
export const AnchorPointActionType = {
  CREATE: 'CREATE',
  MODIFY: 'MODIFY',
  DELETE: 'DELETE',
  PAIRING: 'PAIRING',
  UNPAIRING: 'UNPAIRING',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AnchorPointActionType = typeof AnchorPointActionType[keyof typeof AnchorPointActionType];

export const AnchorPointActionTypeLabel: {
  [k in AnchorPointActionType]: string;
} = {
  CREATE: '등록',
  MODIFY: '수정',
  DELETE: '삭제',
  PAIRING: '즉시편성',
  UNPAIRING: '편성취소',
};

/**
 * 앵커포인트 액션타입 Confirm 메세지
 */
export const AnchorPointActionTypeConfirmMessage: {
  [k in AnchorPointActionType]: string;
} = {
  CREATE: '앵커포인트를 등록 하시겠습니까?',
  MODIFY: '앵커포인트를 수정 하시겠습니까?',
  DELETE: '앵커포인트를 삭제 하시겠습니까?',
  PAIRING: '앵커포인트를 즉시편성 하시겠습니까?',
  UNPAIRING: '앵커포인트를 편성을 취소하시겠습니까?',
};

/**
 * 앵커포인트 액션타입 Complete 메세지
 */
export const AnchorPointActionTypeCompleteMessage: {
  [k in AnchorPointActionType]: string;
} = {
  CREATE: '앵커포인트를 등록 하였습니다.',
  MODIFY: '앵커포인트를 수정 하였습니다.',
  DELETE: '앵커포인트를 삭제 하였습니다.',
  PAIRING: '앵커포인트를 즉시편성 하였습니다.',
  UNPAIRING: '앵커포인트를 편성을 취소하였습니다.',
};

/**
 * 앵커포인트 액션타입 Complete 메세지
 */
export const AnchorPointActionTypeErrorMessage: {
  [k in AnchorPointActionType]: string;
} = {
  CREATE: '앵커포인트를 등록 요청에 문제가 발생하였습니다.',
  MODIFY: '앵커포인트를 수정 요청에 문제가 발생하였습니다.',
  DELETE: '앵커포인트를 삭제 요청에 문제가 발생하였습니다.',
  PAIRING: '앵커포인트를 즉시편성 요청에 문제가 발생하였습니다.',
  UNPAIRING: '앵커포인트를 편성취소 요청에 문제가 발생하였습니다.',
};

/**
 * 채팅 검색 타입
 */
export const ChatSearchType = {
  ALL: 'all',
  NICKNAME: 'nickname',
  MESSAGE: 'message',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ChatSearchType = typeof ChatSearchType[keyof typeof ChatSearchType];

export const ChatSearchTypeLabel: {
  [k in ChatSearchType]: string;
} = {
  [ChatSearchType.ALL]: '닉네임 + 내용',
  [ChatSearchType.NICKNAME]: '닉네임',
  [ChatSearchType.MESSAGE]: '내용',
};

/**
 * 쇼타임 키워드 업데이트 타입
 */
export const ShowtimeKeywordUpdateType = {
  ADD: 'ADD',
  DELETE: 'DELETE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShowtimeKeywordUpdateType = typeof ShowtimeKeywordUpdateType[keyof typeof ShowtimeKeywordUpdateType];

/**
 * 쇼타임 상품검색 type
 */
export const ShowtimeGoodsSearchType = {
  NAME: 'NAME',
  ID: 'ID',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShowtimeGoodsSearchType = typeof ShowtimeGoodsSearchType[keyof typeof ShowtimeGoodsSearchType];

export const ShowtimeGoodsSearchTypeLabel: {
  [k in ShowtimeGoodsSearchType]: string;
} = {
  NAME: '상품명',
  ID: 'ID',
};

/**
 *  경매 상품 타입
 */
export const AuctionGoodsType = {
  GOODS: 'GOODS',
  TICKET: 'TICKET',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AuctionGoodsType = typeof AuctionGoodsType[keyof typeof AuctionGoodsType];

export const AuctionGoodsTypeLabel: {
  [k in AuctionGoodsType]: string;
} = {
  GOODS: '일반',
  TICKET: '티켓(일반)',
};

/**
 * PIPMode
 */
export const PIPMode = {
  ON: 'ON',
  OFF: 'OFF',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PIPMode = typeof PIPMode[keyof typeof PIPMode];

export const PIPModeLabel: {
  [k in PIPMode]: string;
} = {
  [PIPMode.ON]: 'ON',
  [PIPMode.OFF]: 'OFF',
};

/**
 * 사전 응모 조건 타입
 */
export const EnterDrawConditionType = {
  FILE_UPLOAD: 'FILE_UPLOAD',
  NONE: 'NONE',
  SHOW_ROOM_FOLLOWER: 'SHOW_ROOM_FOLLOWER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EnterDrawConditionType = typeof EnterDrawConditionType[keyof typeof EnterDrawConditionType];

export const EnterDrawConditionTypesLabel: {
  [k in EnterDrawConditionType]: string;
} = {
  [EnterDrawConditionType.FILE_UPLOAD]: '사용자 지정',
  [EnterDrawConditionType.NONE]: '없음',
  [EnterDrawConditionType.SHOW_ROOM_FOLLOWER]: '쇼룸 팔로우',
};

/**
 * 래플 이벤트 상태
 */
export const RaffleEventStatus = {
  COMPLETED: 'COMPLETED',
  DRAW: 'DRAW',
  STANDBY: 'STANDBY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RaffleEventStatus = typeof RaffleEventStatus[keyof typeof RaffleEventStatus];

export const RaffleEventStatusLabel: {
  [k in RaffleEventStatus]: string;
} = {
  [RaffleEventStatus.COMPLETED]: '완료',
  [RaffleEventStatus.DRAW]: '대기중',
  [RaffleEventStatus.STANDBY]: '대기중',
};

export const RaffleEventStatusInfoText: {
  [k in RaffleEventStatus]: string;
} = {
  [RaffleEventStatus.COMPLETED]: '당첨자 발표 완료 되었습니다.',
  [RaffleEventStatus.DRAW]: '당첨자 데이터 추출 완료. 당첨자를 발표 할 수 있습니다.',
  [RaffleEventStatus.STANDBY]: '당첨자 데이터 추출을 진행 해주세요.',
};

/**
 * 래플 이벤트 당첨자 엑셀 코드
 */
export const RaffleEventWinnerExcelCode = {
  email: '이메일',
  nickname: '닉네임',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RaffleEventWinnerExcelCode = typeof RaffleEventWinnerExcelCode[keyof typeof RaffleEventWinnerExcelCode];

/**
 * OrderingType
 */
export const OrderingType = {
  FIRST: 'FIRST',
  LAST: 'LAST',
  PREV: 'PREV',
  NEXT: 'NEXT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderingType = typeof OrderingType[keyof typeof OrderingType];
