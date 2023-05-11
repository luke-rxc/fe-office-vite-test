import { lazy, useCallback } from 'react';
import { DiscoverKeywordMappingType } from '../constants';
import { ReturnTypeUseDiscoverKeywordModifyService } from '../services';

const DiscoverKeywordContentsList = lazy(() => import('./DiscoverKeywordContentsList'));
const DiscoverKeywordGoodsList = lazy(() => import('./DiscoverKeywordGoodsList'));
const DiscoverKeywordShowroomList = lazy(() => import('./DiscoverKeywordShowroomList'));

export interface DiscoverKeywordMappingListProps {
  type: ReturnTypeUseDiscoverKeywordModifyService['currentTabType'];
  listItems: ReturnTypeUseDiscoverKeywordModifyService['listItems'];
  dataUpdatedAt: ReturnTypeUseDiscoverKeywordModifyService['dataUpdatedAt'];
  isEdit: ReturnTypeUseDiscoverKeywordModifyService['isEdit'];
  isLoading: ReturnTypeUseDiscoverKeywordModifyService['isLoading'];
  onReloadTypeList: ReturnTypeUseDiscoverKeywordModifyService['handleReloadTypeList'];
  onOpenAddItemModal: () => void;
  onOpenBulkMappingModal: () => void;
}

export const DiscoverKeywordMappingList = ({ type, listItems, ...props }: DiscoverKeywordMappingListProps) => {
  const getList = useCallback(() => {
    switch (type) {
      case DiscoverKeywordMappingType.GOODS:
        return <DiscoverKeywordGoodsList goods={listItems.goods} {...props} />;
      case DiscoverKeywordMappingType.CONTENTS:
        return <DiscoverKeywordContentsList contents={listItems.contents} {...props} />;
      case DiscoverKeywordMappingType.SHOWROOM:
        return <DiscoverKeywordShowroomList showroom={listItems.showroom} {...props} />;

      default:
        return null;
    }
  }, [type, listItems, props]);

  return getList();
};
