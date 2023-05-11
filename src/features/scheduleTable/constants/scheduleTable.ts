/**
 * 편성표 조회 query key
 */
export const scheduleTableQueryKey = 'schedule/table';
/**
 * 편성표 아이템 조회 query key
 */
export const scheduleTableItemQueryKey = 'schedule/table/item';

/**
 * 오늘의 주차 기준값
 * 0: 이번 주, -1: 전 주, 1: 다음주
 */
export const WeekNumberByToday = 0;

/**
 * 요일 title
 */
export const DayTitles = [
  { title: '월', weekday: 1 },
  { title: '화', weekday: 2 },
  { title: '수', weekday: 3 },
  { title: '목', weekday: 4 },
  { title: '금', weekday: 5 },
  { title: '토', weekday: 6 },
  { title: '일', weekday: 0 },
];

/**
 * base 스킴
 */
export const PrizmBaseScheme = 'prizm://prizm.co.kr';

/**
 * 라이브 contents type
 */
export const LiveContentsType = {
  AUCTION: 'AUCTION',
  STANDARD: 'STANDARD',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LiveContentsType = typeof LiveContentsType[keyof typeof LiveContentsType];

export const LiveContentsTypeLabel: {
  [k in LiveContentsType]: string;
} = {
  [LiveContentsType.AUCTION]: '경매',
  [LiveContentsType.STANDARD]: '일반',
};

/**
 * 편성표 type
 */
export const ScheduleType = {
  LIVE: 'LIVE',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ScheduleType = typeof ScheduleType[keyof typeof ScheduleType];

export const ScheduleTypeLabel: {
  [k in ScheduleType]: string;
} = {
  [ScheduleType.LIVE]: 'LIVE',
};

/**
 * 편성표 배너 type
 */
export const ScheduleBannerType = {
  NONE: 'NONE',
  BUTTON: 'BUTTON',
  GOODS: 'GOODS',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ScheduleBannerType = typeof ScheduleBannerType[keyof typeof ScheduleBannerType];

export const ScheduleBannerTypeLabel: {
  [k in ScheduleBannerType]: string;
} = {
  [ScheduleBannerType.NONE]: '없음',
  [ScheduleBannerType.BUTTON]: 'CTA 버튼',
  [ScheduleBannerType.GOODS]: '상품',
};

/**
 * 편성표 상세 item 기본정보
 */
export const ScheduleTableDetailBaseInfo = {
  ID: 'id',
  CONTENTS_TYPE: 'contentsTypeText',
  LIVE_START_DATE: 'liveStartDateText',
  SHOWROOM_NAME: 'showRoomName',
  TITLE: 'title',
  GUEST_SHOWROOM_NAME: 'guestShowRoomNames',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ScheduleTableDetailBaseInfo = typeof ScheduleTableDetailBaseInfo[keyof typeof ScheduleTableDetailBaseInfo];

export const ScheduleTableDetailBaseInfoLabel: {
  [k in ScheduleTableDetailBaseInfo]: string;
} = {
  [ScheduleTableDetailBaseInfo.ID]: '라이브 번호',
  [ScheduleTableDetailBaseInfo.CONTENTS_TYPE]: '라이브 타입',
  [ScheduleTableDetailBaseInfo.LIVE_START_DATE]: '라이브 시작일시',
  [ScheduleTableDetailBaseInfo.SHOWROOM_NAME]: '호스트 쇼룸',
  [ScheduleTableDetailBaseInfo.TITLE]: '라이브 제목',
  [ScheduleTableDetailBaseInfo.GUEST_SHOWROOM_NAME]: '게스트 쇼룸',
};

/**
 * 랜딩 타입
 */
export const LandingType = {
  MODAL: 'MODAL',
  STORY: 'STORY',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LandingType = typeof LandingType[keyof typeof LandingType];

export const LandingTypeLabel: {
  [k in LandingType]: string;
} = {
  [LandingType.MODAL]: '티저 모달',
  [LandingType.STORY]: '콘텐츠',
};

/**
 * 공개 상태
 */
export const SchedulingStatus = {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SchedulingStatus = typeof SchedulingStatus[keyof typeof SchedulingStatus];

export const SchedulingStatusLabel: {
  [k in SchedulingStatus]: string;
} = {
  [SchedulingStatus.OPENED]: '공개',
  [SchedulingStatus.CLOSED]: '비공개',
};

/**
 * 편성표 업로드 타입
 */
export const ScheduleTableUploadType = {
  BG: 'BG',
  CHROMAKEY: 'CHROMAKEY',
  BANNER: 'BANNER',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ScheduleTableUploadType = typeof ScheduleTableUploadType[keyof typeof ScheduleTableUploadType];
