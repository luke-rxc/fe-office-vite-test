import { DiscoverSectionDisplayType } from '../constants';
import { ShowroomModel } from '../models';
import { DiscoverSectionTypeListProps } from './DiscoverSectionTypeList';
import { DiscoverSectionTypeListHeader } from './DiscoverSectionTypeListHeader';
import { DiscoverShowroomList } from './DiscoverShowroomList';

interface Props extends Omit<DiscoverSectionTypeListProps, 'type'> {
  items: Array<ShowroomModel>;
}

const DiscoverSectionShowroomList = ({
  displayType,
  items,
  isLoading,
  pagination,
  dataUpdatedAt,
  onReloadList: handleReloadList,
}: Props) => {
  return (
    <DiscoverShowroomList
      hideKeywordColumn={displayType !== DiscoverSectionDisplayType.CURATION}
      items={items}
      isLoading={isLoading}
      pagination={pagination}
      stickyHeader
      actions={
        <DiscoverSectionTypeListHeader
          title="쇼룸"
          displayType={displayType}
          dataUpdatedAt={dataUpdatedAt}
          pagination={pagination}
          infoLabel="해당 섹션의 전시 쇼룸 리스트를 확인하세요"
          infoCurationLabel="해당 섹션의 전시 쇼룸 리스트를 확인하세요"
          tooltipLabel="최근 7일간 쇼룸 조회수 + 팔로우 수가 높은 브랜드 쇼룸"
          tooltipCurationLabel="설정한 각 Keyword에 매핑된 브랜드 쇼룸 리스트"
          onReloadList={handleReloadList}
        />
      }
    />
  );
};

export default DiscoverSectionShowroomList;
