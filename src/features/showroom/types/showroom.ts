import { AutoCompleteFieldValue, SelectFieldOption, FileFieldValue } from './common';

/**
 * 쇼룸 타입
 */
export type ShowroomType = 'NORMAL' | 'CONCEPT';

/**
 * 쇼룸 상태
 */
export type ShowroomStatus = 'ADMIN_PUBLIC' | 'PRIVATE' | 'PUBLIC';

/**
 * 추가 불가능한 소속쇼룸 상태
 */
export type UnAddableSubShowroomStatus = 'PRIVATE' | 'ADMIN_PUBLIC';

/**
 * 쇼룸 테이블의 목록 아이템 타입
 */
export interface ShowroomListItem {
  id: number;
  code: string;
  name: string;
  providerName: string;
  brandName: string;
  keywords: string[];
  createdDate: string;
  updatedDate: string;
  status: ShowroomStatus;
}

/**
 * ShowroomSearch 데이터 타입(form values)
 */
export interface ShowroomSearchFields {
  type?: 'ALL' | ShowroomType;
  status?: 'ALL' | ShowroomStatus;
  searchType?: 'ALL' | 'ID' | 'CODE' | 'NAME' | 'PROVIDER_NAME' | 'BRAND_NAME';
  dateType?: 'ALL' | 'CREATE' | 'UPDATE';
  size?: number;
  page?: number;
  keyword?: string;
  startDate?: number;
  endDate?: number;
  keywords?: AutoCompleteFieldValue[];
  exceptShowRoomIds?: number[];
}

/**
 * ShowroomSearch 옵션 타입
 */
export interface ShowroomSearchFieldOptions {
  type: SelectFieldOption<ShowroomSearchFields['type']>[];
  status: SelectFieldOption<ShowroomSearchFields['status']>[];
  dateType: SelectFieldOption<ShowroomSearchFields['dateType']>[];
  searchType: SelectFieldOption<ShowroomSearchFields['searchType']>[];
  keywords: ShowroomSearchFields['keywords'];
}

/**
 * ShowroomForm(수정/생성) 데이터 타입(form values)
 */
export interface ShowroomFormFields {
  description: string;
  code: string;
  name: string;
  primaryImage: FileFieldValue;
  coverMedia: FileFieldValue;
  lottieImage: FileFieldValue;
  type: AutoCompleteFieldValue<ShowroomType>;
  status: AutoCompleteFieldValue<ShowroomStatus>;
  brand: AutoCompleteFieldValue;
  provider: AutoCompleteFieldValue;
  keywords: AutoCompleteFieldValue[];
  tintColor: string;
  textColor: string;
  contentColor: string;
  backgroundColor: string;
  discoverUse: boolean;
}

/**
 * ShowroomForm(수정/생성) 필드 옵션
 */
export interface ShowroomFormFieldOptions {
  type: ShowroomFormFields['type'][];
  status: ShowroomFormFields['status'][];
  brand: ShowroomFormFields['brand'][];
  provider: ShowroomFormFields['provider'][];
  keywords: ShowroomFormFields['keywords'];
}
