/**
 * 라이브 콤보 query keys
 */
export const RaffleLiveQueryKeys = {
  all: [{ scope: 'raffle-live' }] as const,
  list: () => [{ ...RaffleLiveQueryKeys.all[0], entity: 'list' }] as const,
  detail: (liveId: number) => [{ ...RaffleLiveQueryKeys.all[0], entity: 'detail', liveId }] as const,
} as const;

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

/**
 * 라이브 상태 라벨
 */
export const LiveStatusLabel: {
  [k in LiveStatus]: string;
} = {
  [LiveStatus.NONE]: '없음',
  [LiveStatus.STANDBY]: '대기',
  [LiveStatus.READY]: '준비',
  [LiveStatus.REPLAY]: '리플레이',
  [LiveStatus.CREATING]: '생성중',
  [LiveStatus.END]: '종료',
  [LiveStatus.LIVE]: '진행중',
  [LiveStatus.REHEARSAL]: '리허설',
};
