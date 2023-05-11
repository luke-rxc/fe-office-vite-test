import { lazy, useCallback } from 'react';
import { DiscoverSectionType } from '../constants';
import { ContentsModel, GoodsModel, ShowroomModel } from '../models';
import { ReturnTypeUseDiscoverSectionModifyService } from '../services';

const DiscoverSectionContentsList = lazy(() => import('./DiscoverSectionContentsList'));
const DiscoverSectionGoodsList = lazy(() => import('./DiscoverSectionGoodsList'));
const DiscoverSectionLiveList = lazy(() => import('./DiscoverSectionLiveList'));
const DiscoverSectionShowroomList = lazy(() => import('./DiscoverSectionShowroomList'));

export interface DiscoverSectionTypeListProps {
  type: ReturnTypeUseDiscoverSectionModifyService['discoverSectionItem']['sectionType'];
  displayType: ReturnTypeUseDiscoverSectionModifyService['discoverSectionItem']['displayType'];
  items: ReturnTypeUseDiscoverSectionModifyService['items'];
  dataUpdatedAt: ReturnTypeUseDiscoverSectionModifyService['dataUpdatedAt'];
  isLoading: ReturnTypeUseDiscoverSectionModifyService['isLoading'];
  pagination?: ReturnTypeUseDiscoverSectionModifyService['pagination'];
  onReloadList: ReturnTypeUseDiscoverSectionModifyService['handleReloadTypeList'];
}

export const DiscoverSectionTypeList = ({ type, items, ...props }: DiscoverSectionTypeListProps) => {
  const getList = useCallback(() => {
    switch (type) {
      case DiscoverSectionType.GOODS:
        return <DiscoverSectionGoodsList items={items as Array<GoodsModel>} {...props} />;
      case DiscoverSectionType.STORY:
        return <DiscoverSectionContentsList items={items as Array<ContentsModel>} {...props} />;
      case DiscoverSectionType.SHOWROOM:
        return <DiscoverSectionShowroomList items={items as Array<ShowroomModel>} {...props} />;
      case DiscoverSectionType.LIVE:
        return <DiscoverSectionLiveList />;

      default:
        return null;
    }
  }, [type, items, props]);

  return getList();
};
