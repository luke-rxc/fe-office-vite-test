import { LabelColor } from '@components/Label';
import { SectionListItem, SectionFormFields, SectionFormFieldOptions } from '../types';

/**
 * 전시 섹션 상태값에 대응하는 boolean
 */
export const SectionStatusValue: { [key in SectionListItem['status']]: boolean } = {
  PRIVATE: false,
  PUBLIC: true,
} as const;

/**
 * 전시섹션 상태 라벨
 */
export const SectionStatusLabel: { [key in SectionListItem['status']]: string } = {
  PRIVATE: '비공개',
  PUBLIC: '공개',
} as const;

/**
 * 전시섹션 상태에 따른 강조색상
 */
export const SectionStatusColor: { [key in SectionListItem['status']]: LabelColor } = {
  PRIVATE: 'secondary',
  PUBLIC: 'success',
} as const;

/**
 * 전시섹션 필드 기본 값
 */
export const SectionFieldDefaultValues: Omit<SectionFormFields, 'contentIds'> = {
  name: '',
  order: 1,
  status: 'PRIVATE',
};

/**
 * 전시섹션 상태 필드 옵션
 */
export const SectionFormStatusFieldOptions: SectionFormFieldOptions['status'] = [
  { value: 'PRIVATE', label: '비공개' },
  { value: 'PUBLIC', label: '공개' },
];
