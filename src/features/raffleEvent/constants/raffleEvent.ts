export const RaffleEventQueryKeys = {
  all: [{ scope: 'raffle-event' }] as const,
  lists: () => [{ ...RaffleEventQueryKeys.all[0], entity: 'list' }] as const,
  list: (params: any) => [{ ...RaffleEventQueryKeys.lists()[0], params }] as const,
  detail: (raffleId: number) => [{ ...RaffleEventQueryKeys.all[0], entity: 'detail', raffleId }] as const,
} as const;

/**
 * 검색 page number 기본값
 */
export const defaultSearchPage = '1';
/**
 * 검색 page size 기본값
 */
export const defaultSearchSize = '10';
/**
 * rowsPerPageOptions
 */
export const rowsPerPageOptions = [10, 25, 50, 100, 500, 1000];

/**
 * 래플 이벤트 리스트 검색조건
 */
export const RaffleEventListSearchField = {
  RAFFLE_NAME: 'RAFFLE_NAME',
  RAFFLE_ID: 'RAFFLE_ID',
  LIVE_TITLE: 'LIVE_TITLE',
  LIVE_ID: 'LIVE_ID',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RaffleEventListSearchField = typeof RaffleEventListSearchField[keyof typeof RaffleEventListSearchField];

/**
 * 래플 이벤트 리스트 검색조건 라벨
 */
export const RaffleEventListSearchFieldLabel: {
  [k in RaffleEventListSearchField]: string;
} = {
  [RaffleEventListSearchField.RAFFLE_NAME]: '이벤트명',
  [RaffleEventListSearchField.RAFFLE_ID]: '이벤트 ID',
  [RaffleEventListSearchField.LIVE_TITLE]: '라이브 명',
  [RaffleEventListSearchField.LIVE_ID]: '라이브 ID',
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

export const EnterDrawConditionTypeLabel: {
  [k in EnterDrawConditionType]: string;
} = {
  [EnterDrawConditionType.FILE_UPLOAD]: '사용자 지정 (파일 업로드)',
  [EnterDrawConditionType.NONE]: '응모 조건 없음',
  [EnterDrawConditionType.SHOW_ROOM_FOLLOWER]: '쇼룸 팔로우 (* 라이브 알림신청 포함)',
};

/**
 * 추가 당첨조건 타입
 */
export const WinnerConditionType = {
  LIVE_AUDIENCE: 'LIVE_AUDIENCE',
  NONE: 'NONE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type WinnerConditionType = typeof WinnerConditionType[keyof typeof WinnerConditionType];

export const WinnerConditionTypeLabel: {
  [k in WinnerConditionType]: string;
} = {
  [WinnerConditionType.LIVE_AUDIENCE]: '라이브 방송 시청자',
  [WinnerConditionType.NONE]: '추가 당첨조건 없음',
};

/**
 * 중복 당첨자 허용 여부 타입
 */
export const AllowDuplicateWinnerType = {
  ALLOW: 'ALLOW',
  DENY: 'DENY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AllowDuplicateWinnerType = typeof AllowDuplicateWinnerType[keyof typeof AllowDuplicateWinnerType];

export const AllowDuplicateWinnerTypeLabel: {
  [k in AllowDuplicateWinnerType]: string;
} = {
  [AllowDuplicateWinnerType.ALLOW]: '중복 당첨 가능',
  [AllowDuplicateWinnerType.DENY]: '중복 당첨 불가 (라이브 방송 기준)',
};

/**
 * 사전 응모 기간설정 타입
 */
export const EnterDrawPeriodType = {
  SETUP: 'SETUP',
  NOTSET: 'NOTSET',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EnterDrawPeriodType = typeof EnterDrawPeriodType[keyof typeof EnterDrawPeriodType];

export const EnterDrawPeriodTypeLabel: {
  [k in EnterDrawPeriodType]: string;
} = {
  [EnterDrawPeriodType.SETUP]: '응모 기간 설정',
  [EnterDrawPeriodType.NOTSET]: '응모 기간 미설정',
};

/**
 * 응모대상자 엑셀 코드
 */
export const RaffleEventUserExcelCode = {
  email: '사용자 이메일',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RaffleEventUserExcelCode = typeof RaffleEventUserExcelCode[keyof typeof RaffleEventUserExcelCode];

/**
 *
 */
export const RaffleEventBroadcastStatus = {
  NONE: 'NONE',
  REHEARSAL: 'REHEARSAL',
  LIVE: 'LIVE',
  END: 'END',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RaffleEventBroadcastStatus = typeof RaffleEventBroadcastStatus[keyof typeof RaffleEventBroadcastStatus];

export const RaffleEventBroadcastStatusLabel: {
  [k in RaffleEventBroadcastStatus]: string;
} = {
  [RaffleEventBroadcastStatus.NONE]: '대기중',
  [RaffleEventBroadcastStatus.REHEARSAL]: '리허설',
  [RaffleEventBroadcastStatus.LIVE]: '라이브',
  [RaffleEventBroadcastStatus.END]: '종료',
};

/**
 * 사전 응모 조건 타입 options
 */
export const enterDrawConditionTypeOptions = [
  EnterDrawConditionType.SHOW_ROOM_FOLLOWER,
  EnterDrawConditionType.FILE_UPLOAD,
  EnterDrawConditionType.NONE,
].map((value) => {
  return {
    label: EnterDrawConditionTypeLabel[value],
    value,
  };
});

/**
 * 추가 당첨조건 타입 options
 */
export const winnerConditionTypeOptions = [WinnerConditionType.NONE, WinnerConditionType.LIVE_AUDIENCE].map((value) => {
  return {
    label: WinnerConditionTypeLabel[value],
    value,
  };
});

/**
 * 중복 당첨자 허용 여부 타입 options
 */
export const allowDuplicateWinnerTypeOptions = [AllowDuplicateWinnerType.DENY, AllowDuplicateWinnerType.ALLOW].map(
  (value) => {
    return {
      label: AllowDuplicateWinnerTypeLabel[value],
      value,
    };
  },
);

/**
 * 사전 응모 기간설정 타입 options
 */
export const enterDrawPeriodTypeOptions = [EnterDrawPeriodType.NOTSET, EnterDrawPeriodType.SETUP].map((value) => {
  return {
    label: EnterDrawPeriodTypeLabel[value],
    value,
  };
});
