import { DiscoverSectionDisplayType } from '../constants';
import { GoodsModel } from '../models';
import { DiscoverGoodsList } from './DiscoverGoodsList';
import { DiscoverSectionTypeListProps } from './DiscoverSectionTypeList';
import { DiscoverSectionTypeListHeader } from './DiscoverSectionTypeListHeader';

interface Props extends Omit<DiscoverSectionTypeListProps, 'type'> {
  items: Array<GoodsModel>;
}

const DiscoverSectionGoodsList = ({
  displayType,
  items,
  isLoading,
  pagination,
  dataUpdatedAt,
  onReloadList: handleReloadList,
}: Props) => {
  return (
    <DiscoverGoodsList
      hideKeywordColumn={displayType !== DiscoverSectionDisplayType.CURATION}
      items={items}
      isLoading={isLoading}
      pagination={pagination}
      showShowroom
      stickyHeader
      actions={
        <DiscoverSectionTypeListHeader
          title="상품"
          displayType={displayType}
          dataUpdatedAt={dataUpdatedAt}
          pagination={pagination}
          infoLabel="해당 섹션의 전시 상품 리스트를 확인하세요"
          infoCurationLabel="해당 섹션에서 전시될 상품 리스트를 확인하세요"
          tooltipLabel="최근 7일간 판매중 등록된 상품 (제외 case: 판매예정 상품)"
          tooltipCurationLabel="설정한 각 Keyword에 매핑된 상품 리스트"
          onReloadList={handleReloadList}
        />
      }
    />
  );
};

export default DiscoverSectionGoodsList;
