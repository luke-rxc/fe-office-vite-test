import { PaginationProps } from '@components/table/Table';
import { QueryState } from '@hooks/useQueryState';
import { DiscoverFeedDisplayGroupType, FEED_DEFAULT_LIMIT, FEED_DEFAULT_PAGE } from '../constants';

export interface DiscoverFeedPaginationProps extends PaginationProps {
  enabledPrev: boolean;
  enabledNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onCurrent: () => void;
}

/**
 * 디스커버 피드 query state
 */
export interface DiscoverFeedQueryState extends QueryState {
  page: string;
  type: string;
}

/**
 * 디스커버 피드 전시그룹 params
 */
export interface DiscoverFeedDisplayGroupParams {
  page: number;
  size: number;
  type: string;
}

/**
 * 디스커버 피드 query state > 디스커버 피드 전시그룹 params convert
 */
export const toDiscoverFeedDisplayGroupParams = (
  item: DiscoverFeedQueryState,
  targetType: DiscoverFeedDisplayGroupType,
): DiscoverFeedDisplayGroupParams => {
  const type = item.type ?? DiscoverFeedDisplayGroupType.ENABLED;

  if (type !== targetType) {
    return {
      page: FEED_DEFAULT_PAGE,
      size: FEED_DEFAULT_LIMIT,
      type: targetType,
    };
  }

  return {
    page: item.page ? Number(item.page) : FEED_DEFAULT_PAGE,
    size: FEED_DEFAULT_LIMIT,
    type,
  };
};

/**
 * 디스커버 피드 form field
 */
export interface DiscoverFeedFormField {
  displayStartDate: string;
}

/**
 * 디스커버 피드 전시그룹 form field
 */
export interface DiscoverFeedDisplayGroupFormField {
  displayGroup: string;
}

/**
 * 디스커버 피드 섹션 item
 */
interface DiscoverFeedSectionItem {
  id: number;
  sortNum: number;
}

/**
 * 디스커버 피드 전시그룹 생성/수정 params
 */
export interface DiscoverFeedDisplayGroupInfoParams {
  feedId?: string;
  displayStartDate: number;
  sections: Array<DiscoverFeedSectionItem>;
}
