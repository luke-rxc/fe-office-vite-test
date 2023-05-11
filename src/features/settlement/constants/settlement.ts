import { SettlementSearchForm } from '../types';

/** 정산목록 필터 기본값 */
export const SettlementSearchFormDefaultValues: SettlementSearchForm = {
  year: new Date().getTime(),
  round: 0,
  count: 0,
  page: 1,
  size: 10,
} as const;

/** 정상 목록 페이지 로케이션 */
export const SettlementPageLocation = {
  title: '정산 조회/관리',
  locations: [
    { text: '정산', path: '/settlement/list' },
    { text: '정산 조회/관리', path: '/settlement/list' },
  ],
};
