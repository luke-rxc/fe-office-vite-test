import { DiscoverSectionDisplayType } from '../constants';
import { ContentsModel } from '../models';
import { DiscoverContentsList } from './DiscoverContentsList';
import { DiscoverSectionTypeListProps } from './DiscoverSectionTypeList';
import { DiscoverSectionTypeListHeader } from './DiscoverSectionTypeListHeader';

interface Props extends Omit<DiscoverSectionTypeListProps, 'type'> {
  items: Array<ContentsModel>;
}

const DiscoverSectionContentsList = ({
  displayType,
  items,
  isLoading,
  pagination,
  dataUpdatedAt,
  onReloadList: handleReloadList,
}: Props) => {
  return (
    <DiscoverContentsList
      hideKeywordColumn={displayType !== DiscoverSectionDisplayType.CURATION}
      items={items}
      isLoading={isLoading}
      pagination={pagination}
      showBrand
      stickyHeader
      actions={
        <DiscoverSectionTypeListHeader
          title="콘텐츠"
          displayType={displayType}
          dataUpdatedAt={dataUpdatedAt}
          pagination={pagination}
          infoLabel="해당 섹션의 전시 콘텐츠 리스트를 확인하세요"
          infoCurationLabel="해당 섹션의 전시 콘텐츠 리스트를 확인하세요"
          tooltipLabel="최근 7일 이내 공개 상태로 등록된 콘텐츠"
          tooltipCurationLabel="설정한 각 Keyword에 매핑된 콘텐츠 리스트"
          onReloadList={handleReloadList}
        />
      }
    />
  );
};

export default DiscoverSectionContentsList;
