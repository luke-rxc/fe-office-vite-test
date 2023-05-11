/**
 * 쇼룸 리스트 query key
 */
export const showroomComboListQueryKey = 'showtime/showroom/combo/list';

/**
 * 쇼룸 타입
 */
export const ShowroomType = {
  HOST: 'HOST',
  GUEST: 'GUEST',
  ETC: 'ETC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ShowroomType = typeof ShowroomType[keyof typeof ShowroomType];

export const ShowroomTypeLabel: {
  [k in ShowroomType]: string;
} = {
  [ShowroomType.HOST]: '호스트 쇼룸',
  [ShowroomType.GUEST]: '게스트 쇼룸',
  [ShowroomType.ETC]: '기타 쇼룸',
};
