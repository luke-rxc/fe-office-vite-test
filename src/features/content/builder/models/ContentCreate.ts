import { ManageListModel } from './Common';

/**
 * 컴포넌트 추가 뷰 내 리스트 모델
 */
export type CreateListItemModel = ManageListModel & {
  addCount: number; // 해당 그룹내에 추가된 컴포넌트 총 개수
};
