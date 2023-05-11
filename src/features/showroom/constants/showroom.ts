import { LabelColor } from '@components/Label';
import {
  ShowroomType,
  ShowroomListItem,
  ShowroomSearchFields,
  ShowroomSearchFieldOptions,
  ShowroomFormFields,
  ShowroomFormFieldOptions,
  UnAddableSubShowroomStatus,
} from '../types';

/**
 * 쇼룸 타입
 */
export const ShowroomTypes: { [key in ShowroomType]: ShowroomType } = {
  NORMAL: 'NORMAL',
  CONCEPT: 'CONCEPT',
} as const;

/**
 * 추가 불가능한 소속쇼룸 상태
 */
export const UnAddableSubShowroomStatutes: { [key in UnAddableSubShowroomStatus]: UnAddableSubShowroomStatus } = {
  PRIVATE: 'PRIVATE',
  ADMIN_PUBLIC: 'ADMIN_PUBLIC',
};

/**
 * 쇼룸 상태 라벨
 */
export const ShowroomStatusLabel: { [key in ShowroomListItem['status']]: string } = {
  PUBLIC: '공개',
  PRIVATE: '비공개',
  ADMIN_PUBLIC: '관리자 공개',
} as const;

/**
 * 쇼룸 상태에 따른 강조색상
 */
export const ShowroomStatusColor: { [key in ShowroomListItem['status']]: LabelColor } = {
  PUBLIC: 'success',
  PRIVATE: 'secondary',
  ADMIN_PUBLIC: 'warning',
} as const;

/**
 * 쇼룸 검색폼 기본값
 */
export const ShowroomSearchFieldDefaultValues: ShowroomSearchFields = {
  page: 1,
  size: 10,
  keyword: '',
  type: 'ALL',
  status: 'ALL',
  dateType: 'ALL',
  searchType: 'NAME',
  endDate: null,
  startDate: null,
  keywords: [],
  exceptShowRoomIds: [],
};

/**
 * 쇼룸 생성 & 수정 폼 기본값
 */
export const ShowroomFieldDefaultValues: ShowroomFormFields = {
  code: '',
  name: '',
  description: '',
  type: null,
  brand: null,
  status: null,
  provider: null,
  tintColor: '',
  textColor: '',
  contentColor: '',
  backgroundColor: '',
  keywords: [],
  coverMedia: [],
  lottieImage: [],
  primaryImage: [],
  discoverUse: false,
};

/**
 * 검색어 검색 조건 - 쇼룸 조회
 * MD쪽에서 전체(ALL)항목 제거 요청하여 프론트단에서 제외함
 */
export const ShowroomSearchTypeOptionsForSearch: ShowroomSearchFieldOptions['searchType'] = [
  // { value: 'ALL', label: '전체' },
  { value: 'NAME', label: '쇼룸명' },
  { value: 'ID', label: '쇼룸ID' },
  { value: 'CODE', label: '쇼룸코드' },
  { value: 'PROVIDER_NAME', label: '입점사' },
  { value: 'BRAND_NAME', label: '브랜드' },
];

/**
 * 날짜 검색 조건 - 쇼룸 조회
 */
export const ShowroomDateTypeOptionsForSearch: ShowroomSearchFieldOptions['dateType'] = [
  { value: 'ALL', label: '전체' },
  { value: 'CREATE', label: '최초 생성일' },
  { value: 'UPDATE', label: '최종 편집일' },
];

/**
 * 쇼룸 공개 상태 - 쇼룸 조회
 */
export const ShowroomStatusForOptionsSearch: ShowroomSearchFieldOptions['status'] = [
  { value: 'ALL', label: '전체' },
  { value: 'PUBLIC', label: '공개' },
  { value: 'PRIVATE', label: '비공개' },
  { value: 'ADMIN_PUBLIC', label: '관리자 공개' },
];

/**
 * 쇼룸 타입 옵션 - 쇼룸 조회 탭UI
 */
export const ShowroomTypeOptionsForSearch: ShowroomSearchFieldOptions['type'] = [
  { value: 'ALL', label: '전체' },
  { value: 'NORMAL', label: '일반 쇼룸' },
  { value: 'CONCEPT', label: '콘셉트 쇼룸' },
];

/**
 * 쇼룸 공개 상태 - 쇼룸 생성 & 수정
 */
export const ShowroomStatusOptions: ShowroomFormFieldOptions['status'] = [
  { id: 'PUBLIC', name: '공개' },
  { id: 'PRIVATE', name: '비공개' },
  { id: 'ADMIN_PUBLIC', name: '관리자 공개' },
];

/**
 * 쇼룸 타입 옵션 - 쇼룸 생성 & 수정
 */
export const ShowroomTypeOptions: ShowroomFormFieldOptions['type'] = [
  { id: 'NORMAL', name: '일반 쇼룸' },
  { id: 'CONCEPT', name: '콘셉트 쇼룸' },
];
