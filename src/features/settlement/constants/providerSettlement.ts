import { sub } from 'date-fns';
import { ProviderSettlementSearchForm } from '../types';

/** 입점사별 정산목록 검색폼 기본값 */
export const ProviderSettlementSearchFormDefaultValues: ProviderSettlementSearchForm = {
  yyyyMm: sub(new Date(), { months: 1 }).getTime(), // 전월
  round: 0,
  count: 0,
  isPaid: 'null',
  isTaxBillPublished: 'null',
  providerName: '',
  page: 1,
  size: 10,
} as const;

/** 입점사별 정상 목록 페이지 로케이션 */
export const ProviderSettlementLocation = {
  title: '입점사별 정산 조회/관리',
  locations: [
    { text: '정산', path: '/settlement/list' },
    { text: '정산 조회/관리', path: '/settlement/list' },
    { text: '입점사별 정산 조회/관리', path: '/settlement/provider/list' },
  ],
};
