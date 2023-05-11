import { DiscoverKeywordMappingType } from '../constants';
import { ReturnTypeUseDiscoverKeywordModifyService } from '../services';
import { DiscoverGoodsList } from './DiscoverGoodsList';
import { DiscoverKeywordMappingListHeader } from './DiscoverKeywordMappingListHeader';
import { DiscoverListOptions } from './DiscoverListOptions';

interface Props {
  goods: ReturnTypeUseDiscoverKeywordModifyService['listItems']['goods'];
  dataUpdatedAt: ReturnTypeUseDiscoverKeywordModifyService['dataUpdatedAt'];
  isEdit: ReturnTypeUseDiscoverKeywordModifyService['isEdit'];
  onReloadTypeList: ReturnTypeUseDiscoverKeywordModifyService['handleReloadTypeList'];
  onOpenAddItemModal: () => void;
  onOpenBulkMappingModal: () => void;
}

const DiscoverKeywordGoodsList = ({
  goods: { list, rowSelection, handleOrder, handleDeleteList },
  dataUpdatedAt,
  isEdit,
  onReloadTypeList: handleReloadTypeList,
  onOpenAddItemModal: handleOpenAddItemModal,
  onOpenBulkMappingModal: handleOpenBulkMappingModal,
}: Props) => {
  return (
    <DiscoverGoodsList
      items={list}
      actions={
        <>
          <DiscoverKeywordMappingListHeader
            title="상품"
            infoLabel="해당 키워드에 맵핑된 맵핑 상품 리스트를 확인 및 편집하세요"
            tooltipLabel="판매예정, 판매중 상태의 상품만 실제 서비스에 노출이 가능합니다"
            totalCount={list.length ?? 0}
            dataUpdatedAt={dataUpdatedAt}
            onReloadList={handleReloadTypeList}
          />
          <DiscoverListOptions
            disabledListAction={rowSelection.selectedRowKeys.length === 0}
            disabledEdit={!isEdit}
            mappingType={DiscoverKeywordMappingType.GOODS}
            onOrder={handleOrder}
            onOpenAddItemModal={handleOpenAddItemModal}
            onOpenBulkMappingModal={handleOpenBulkMappingModal}
            onDeleteGoods={handleDeleteList}
          />
        </>
      }
      isLoading={false}
      pagination={false}
      rowSelection={rowSelection}
      showShowroom
      stickyHeader
    />
  );
};

export default DiscoverKeywordGoodsList;
