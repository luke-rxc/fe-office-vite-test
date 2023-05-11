/**
 * 콘텐츠 테이블 아이템 데이터 타입
 */
export interface ContentListItem {
  showroomName: string;
  providerName: string;
  id: number;
  order: number;
  name: string;
  type: string; //
  imageURL: string;
  startDate: string;
  endDate: string;
  status: 'CLOSED' | 'PUBLISHABLE' | 'PUBLISHED' | 'RESERVED' | 'UNPUBLISHABLE';
}

/**
 * 편성불가 콘텐츠 상태
 */
export type UnAddableContentStatus = 'CLOSED' | 'UNPUBLISHABLE';
