import { LIVE_CONTENT_TYPE, LIVE_OPEN_STATUS, LIVE_SEARCH_FIELD, LIVE_STATUS } from '../constants';

/**
 * 라이브 검색폼 피드
 */
export type LiveSearchFieldModel = {
  // 라이브 콘텐츠 타입
  contentsType: LIVE_CONTENT_TYPE;
  // 라이브 검색어
  keyword: string;
  // 라이브 키워드
  keywordIds: string[];
  // 기간 - 라이브 종료일
  liveEndDate: string;
  // 기간 - 라이브 시작일
  liveStartDate: string;
  // 라이브 상태
  liveStatuses: LIVE_STATUS[];
  // 라이브 오픈 상태
  openStatuses: LIVE_OPEN_STATUS | '';
  // 라이브 검색 유형
  searchField: LIVE_SEARCH_FIELD;
  // 라이브 쇼룸 검색
  showRoomIds: number[];
};

/**
 * 라이브 리스트 조회 쿼리
 */
export type LiveListQueryState = LiveSearchFieldModel & {
  size: string;
  page: string;
};

/**
 * request params
 */
export type LiveRequestParams = {
  openStatuses: LIVE_OPEN_STATUS[];
  searchField: string; // 검색어 유형
  showRoomIds: number[]; // 쇼룸 검색
  keyword: string; // 검색어
  page: string;
  size: string;
};

/**
 * 검색 쿼리 파람
 * @param param
 * @returns
 */
export const toLiveQueryParams = (queryState: LiveListQueryState): LiveRequestParams => {
  const { openStatuses, searchField, showRoomIds, keyword, page, size } = queryState;
  return {
    searchField,
    openStatuses: openStatuses ? [openStatuses] : [],
    showRoomIds,
    keyword,
    page,
    size,
  };
};
