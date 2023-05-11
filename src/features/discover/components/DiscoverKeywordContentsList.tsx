import { DiscoverKeywordMappingType } from '../constants';
import { ReturnTypeUseDiscoverKeywordModifyService } from '../services';
import { DiscoverContentsList } from './DiscoverContentsList';
import { DiscoverKeywordMappingListHeader } from './DiscoverKeywordMappingListHeader';
import { DiscoverListOptions } from './DiscoverListOptions';

interface Props {
  contents: ReturnTypeUseDiscoverKeywordModifyService['listItems']['contents'];
  dataUpdatedAt: ReturnTypeUseDiscoverKeywordModifyService['dataUpdatedAt'];
  isEdit: ReturnTypeUseDiscoverKeywordModifyService['isEdit'];
  onReloadTypeList: ReturnTypeUseDiscoverKeywordModifyService['handleReloadTypeList'];
  onOpenAddItemModal: () => void;
  onOpenBulkMappingModal: () => void;
}

const DiscoverKeywordContentsList = ({
  contents: { list, rowSelection, handleOrder, handleDeleteList },
  dataUpdatedAt,
  isEdit,
  onReloadTypeList: handleReloadTypeList,
  onOpenAddItemModal: handleOpenAddItemModal,
  onOpenBulkMappingModal: handleOpenBulkMappingModal,
}: Props) => {
  return (
    <DiscoverContentsList
      items={list}
      actions={
        <>
          <DiscoverKeywordMappingListHeader
            title="콘텐츠"
            infoLabel="해당 키워드에 맵핑된 맵핑 콘텐츠 리스트를 확인 및 편집하세요"
            tooltipLabel="공개 상태의 콘텐츠만 실제 서비스에 노출이 가능합니다"
            totalCount={list.length ?? 0}
            dataUpdatedAt={dataUpdatedAt}
            onReloadList={handleReloadTypeList}
          />
          <DiscoverListOptions
            disabledListAction={rowSelection.selectedRowKeys.length === 0}
            disabledEdit={!isEdit}
            mappingType={DiscoverKeywordMappingType.CONTENTS}
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
      showBrand
      stickyHeader
    />
  );
};

export default DiscoverKeywordContentsList;
