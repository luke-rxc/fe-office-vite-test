import { LabelColor } from '@components/Label';
import { ContentListItem, UnAddableContentStatus } from '../types';

/**
 * 콘텐츠 상태 라벨
 */
export const ContentStatusLabel: { [key in ContentListItem['status']]: string } = {
  PUBLISHED: '쇼룸 공개중',
  RESERVED: '쇼룸 공개 예정',
  PUBLISHABLE: '편성 가능',
  UNPUBLISHABLE: '편성 불가',
  CLOSED: '편성 종료',
} as const;

/**
 * 콘텐츠 상태에 따른 강조색상
 */
export const ContentStatusColor: { [key in ContentListItem['status']]: LabelColor } = {
  PUBLISHED: 'success',
  RESERVED: 'primary',
  PUBLISHABLE: 'warning',
  UNPUBLISHABLE: 'error',
  CLOSED: 'secondary',
} as const;

/**
 * 편성불가 콘텐츠 상태값
 */
export const UnAddableContentStatutes: { [key in UnAddableContentStatus]: UnAddableContentStatus } = {
  CLOSED: 'CLOSED',
  UNPUBLISHABLE: 'UNPUBLISHABLE',
};
