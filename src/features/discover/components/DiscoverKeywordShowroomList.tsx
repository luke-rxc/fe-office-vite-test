import { DiscoverKeywordMappingType } from '../constants';
import { ReturnTypeUseDiscoverKeywordModifyService } from '../services';
import { DiscoverKeywordMappingListHeader } from './DiscoverKeywordMappingListHeader';
import { DiscoverListOptions } from './DiscoverListOptions';
import { DiscoverShowroomList } from './DiscoverShowroomList';

interface Props {
  showroom: ReturnTypeUseDiscoverKeywordModifyService['listItems']['showroom'];
  dataUpdatedAt: ReturnTypeUseDiscoverKeywordModifyService['dataUpdatedAt'];
  isEdit: ReturnTypeUseDiscoverKeywordModifyService['isEdit'];
  onReloadTypeList: ReturnTypeUseDiscoverKeywordModifyService['handleReloadTypeList'];
  onOpenAddItemModal: () => void;
  onOpenBulkMappingModal: () => void;
}

const DiscoverKeywordShowroomList = ({
  showroom: { list, rowSelection, handleOrder, handleDeleteList },
  dataUpdatedAt,
  isEdit,
  onReloadTypeList: handleReloadTypeList,
  onOpenAddItemModal: handleOpenAddItemModal,
  onOpenBulkMappingModal: handleOpenBulkMappingModal,
}: Props) => {
  return (
    <DiscoverShowroomList
      items={list}
      actions={
        <>
          <DiscoverKeywordMappingListHeader
            title="쇼룸"
            infoLabel="해당 키워드에 맵핑된 맵핑 쇼룸 리스트를 확인 및 편집하세요"
            tooltipLabel="공개 상태의 쇼룸만 실제 서비스에 노출이 가능합니다"
            totalCount={list.length ?? 0}
            dataUpdatedAt={dataUpdatedAt}
            onReloadList={handleReloadTypeList}
          />
          <DiscoverListOptions
            disabledListAction={rowSelection.selectedRowKeys.length === 0}
            disabledEdit={!isEdit}
            mappingType={DiscoverKeywordMappingType.SHOWROOM}
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
      stickyHeader
    />
  );
};

export default DiscoverKeywordShowroomList;
