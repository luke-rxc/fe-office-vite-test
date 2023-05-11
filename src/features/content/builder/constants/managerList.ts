/**
 * 컨텐츠 타입별로 프리셋을 관리하기 위한 정보
 */
import { ManageListModel } from '../models';
import { Preset, PresetList } from './presetList';

/**
 * 컨텐츠 타입
 */
export const ContentType = {
  STORY: 'STORY',
  TEASER: 'TEASER',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentType = typeof ContentType[keyof typeof ContentType];

/**
 * 콘텐츠 타입별 컴포넌트 관리 정보
 */
export const ManageList: {
  [key in ContentType]: ManageListModel[];
} = {
  // 스토리 타입 - 브랜드 콘텐츠
  STORY: [
    {
      ...PresetList.HEADER,
      maxCount: 1,
      required: true,
      position: 'TOP',
    },
    {
      ...PresetList.MEDIA,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.TEXT,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.MEDIA_VIEWER,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.LIVE,
      components: PresetList.LIVE.components.map((item) => {
        // 싱글 타입은 개수 제한 1개
        const maxCount = item.componentType === Preset.LIVE ? 1 : null;
        return {
          ...item,
          maxCount,
        };
      }),
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.DEAL,
      maxCount: 10,
      required: false,
      position: '',
    },
    {
      ...PresetList.CTA,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.IMAGE_VIEWER,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.BLANK,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.REPLY,
      maxCount: 1,
      required: false,
      position: 'BOTTOM',
    },
    {
      ...PresetList.FOOTER,
      maxCount: 1,
      required: true,
      position: 'BOTTOM',
    },
  ],
  // 티저 타입 - 라이브 예고
  TEASER: [
    {
      ...PresetList.MEDIA,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.TEXT,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.MEDIA_VIEWER,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.LIVE,
      components: PresetList.LIVE.components.map((item) => {
        // 싱글 타입은 개수 제한 1개
        const maxCount = item.componentType === Preset.LIVE ? 1 : null;
        return {
          ...item,
          maxCount,
        };
      }),
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.DEAL,
      maxCount: 10,
      required: false,
      position: '',
    },
    {
      ...PresetList.CTA,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.IMAGE_VIEWER,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.BLANK,
      maxCount: null,
      required: false,
      position: '',
    },
    {
      ...PresetList.REPLY,
      maxCount: 1,
      required: false,
      position: 'BOTTOM',
    },
    {
      ...PresetList.FOOTER,
      maxCount: 1,
      required: true,
      position: 'BOTTOM',
    },
  ],
};
