import { useMemo } from 'react';
import { DiscoverKeywordMappingType, DiscoverKeywordMappingTypeLabel } from '../constants';

interface Props {
  goodsCount: number;
  showRoomCount: number;
  storyCount: number;
}

/**
 * 디스커버 키워드 멥핑 리스트 탭 관련 hook
 */
export const useDiscoverKeywordMappingListTab = ({
  goodsCount,
  showRoomCount,
  storyCount,
}: Props): Array<{ label: string; value: DiscoverKeywordMappingType }> => {
  const tabOptions: Array<{ label: string; value: DiscoverKeywordMappingType }> = useMemo(
    () => [
      {
        label: `${DiscoverKeywordMappingTypeLabel[DiscoverKeywordMappingType.GOODS]}(${goodsCount ?? 0})`,
        value: DiscoverKeywordMappingType.GOODS,
      },
      {
        label: `${DiscoverKeywordMappingTypeLabel[DiscoverKeywordMappingType.SHOWROOM]}(${showRoomCount ?? 0})`,
        value: DiscoverKeywordMappingType.SHOWROOM,
      },
      {
        label: `${DiscoverKeywordMappingTypeLabel[DiscoverKeywordMappingType.CONTENTS]}(${storyCount ?? 0})`,
        value: DiscoverKeywordMappingType.CONTENTS,
      },
    ],
    [goodsCount, showRoomCount, storyCount],
  );

  return tabOptions;
};
