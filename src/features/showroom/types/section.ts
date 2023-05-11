import { SelectFieldOption } from './common';
/**
 * 섹션 테이블 아이템 데이터 타입
 */
export interface SectionListItem {
  id: number;
  order: number;
  title: string;
  type: 'DISCOVER_BANNER' | 'GOODS' | 'SHOWROOM' | 'STORY';
  status: 'PRIVATE' | 'PUBLIC';
  contentCount: number;
  createdDate: string;
  updatedDate: string;
}

/**
 * 섹션 필드
 */
export interface SectionFormFields {
  name: string;
  order: number;
  status: 'PRIVATE' | 'PUBLIC';
  contentIds: number[];
}

/**
 * SectionForm(수정/생성) 필드 옵션
 */
export interface SectionFormFieldOptions {
  status: SelectFieldOption<SectionFormFields['status']>[];
}
