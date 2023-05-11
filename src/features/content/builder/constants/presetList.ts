/**
 * 전체 프리셋에 대한 정보
 */
import { PresetListModel } from '../models';

/**
 * 프리셋 그룹
 */
export const PresetGroup = {
  HEADER: 'HEADER',
  MEDIA: 'MEDIA',
  MEDIA_VIEWER: 'MEDIA_VIEWER',
  TEXT: 'TEXT',
  CTA: 'CTA',
  DEAL: 'DEAL',
  BLANK: 'BLANK',
  IMAGE_VIEWER: 'IMAGE_VIEWER',
  LIVE: 'LIVE',
  REPLY: 'REPLY',
  FOOTER: 'FOOTER',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PresetGroup = typeof PresetGroup[keyof typeof PresetGroup];

/**
 * 프리셋
 */
export const Preset = {
  HEADER: 'HEADER',
  MEDIA_A: 'MEDIA_A',
  MEDIA_B: 'MEDIA_B',
  MEDIA_VIEWER_A: 'MEDIA_VIEWER_A',
  MEDIA_VIEWER_B: 'MEDIA_VIEWER_B',
  TEXT: 'TEXT',
  CTA: 'CTA',
  DEAL_A: 'DEAL_A',
  DEAL_B: 'DEAL_B',
  BLANK: 'BLANK',
  IMAGE_VIEWER: 'IMAGE_VIEWER',
  LIVE: 'LIVE',
  LIVE_MULTIPLE: 'LIVE_MULTIPLE',
  REPLY: 'REPLY',
  FOOTER: 'FOOTER',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Preset = typeof Preset[keyof typeof Preset];

/**
 * 전체 그룹별 프리셋 리스트 정보
 */
export const PresetList: { [key in PresetGroup]: PresetListModel } = {
  HEADER: {
    componentGroup: PresetGroup.HEADER,
    components: [
      {
        componentType: Preset.HEADER,
        description: '헤더 컴포넌트',
        guideImage: '',
      },
    ],
  },
  MEDIA: {
    componentGroup: PresetGroup.MEDIA,
    components: [
      {
        componentType: Preset.MEDIA_A,
        description: '페이드인 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20220209/4baf6cc9-56b0-4be9-b8a2-2644c0e60c1c.gif',
      },
      {
        componentType: Preset.MEDIA_B,
        description: '모션 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20220209/34131781-5e6a-4c49-a738-fad8ec74eee3.gif',
      },
    ],
  },
  MEDIA_VIEWER: {
    componentGroup: PresetGroup.MEDIA_VIEWER,
    components: [
      {
        componentType: Preset.MEDIA_VIEWER_A,
        description: '갤러리 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20220209/20530fbc-a473-43e1-8c1a-2d0fd818e1ee.gif',
      },
      {
        componentType: Preset.MEDIA_VIEWER_B,
        description: '컬렉션 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20220209/3d7b9288-0d54-43c3-84ef-ce23c172d3de.gif',
      },
    ],
  },
  TEXT: {
    componentGroup: PresetGroup.TEXT,
    components: [
      {
        componentType: Preset.TEXT,
        description: '텍스트 컴포넌트',
        guideImage: '',
      },
    ],
  },
  CTA: {
    componentGroup: PresetGroup.CTA,
    components: [
      {
        componentType: Preset.CTA,
        description: '버튼 컴포넌트',
        guideImage: '',
      },
    ],
  },
  DEAL: {
    componentGroup: PresetGroup.DEAL,
    components: [
      {
        componentType: Preset.DEAL_A,
        description: '리스트 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20220209/8bcf7dca-512d-426b-beea-943fe535fd25.gif',
      },
      {
        componentType: Preset.DEAL_B,
        description: '컬렉션 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20220209/222ad63b-f4d9-4b3f-afe0-8987dce96e86.gif',
      },
    ],
  },
  BLANK: {
    componentGroup: PresetGroup.BLANK,
    components: [
      {
        componentType: Preset.BLANK,
        description: '여백 컴포넌트',
        guideImage: '',
      },
    ],
  },
  IMAGE_VIEWER: {
    componentGroup: PresetGroup.IMAGE_VIEWER,
    components: [
      {
        componentType: Preset.IMAGE_VIEWER,
        description: '이미지 컴포넌트',
        guideImage: '',
      },
    ],
  },
  LIVE: {
    componentGroup: PresetGroup.LIVE,
    components: [
      {
        componentType: Preset.LIVE,
        description: '싱글 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20220209/c807a37e-1d97-44d9-81df-d50393932526.png',
      },
      {
        componentType: Preset.LIVE_MULTIPLE,
        description: '멀티 타입',
        guideImage: 'https://cdn-image.prizm.co.kr/story/20230220/a35e1cd4-7309-4077-81f7-be4adcfd4dde.png',
      },
    ],
  },
  REPLY: {
    componentGroup: PresetGroup.REPLY,
    components: [
      {
        componentType: Preset.REPLY,
        description: '댓글 컴포넌트',
        guideImage: '',
      },
    ],
  },
  FOOTER: {
    componentGroup: PresetGroup.FOOTER,
    components: [
      {
        componentType: Preset.FOOTER,
        description: '푸터 컴포넌트',
        guideImage: '',
      },
    ],
  },
};
