import { CTA_BUTTON_ACTION_TYPE } from '../constants';
import { FormContentCtaButtonModel } from '../models';

/**
 * CTA 버튼 초기값
 */
export const getInitCTAButton = (): FormContentCtaButtonModel => {
  return {
    buttonActionType: CTA_BUTTON_ACTION_TYPE.EXTERNAL_WEB,
    value: '',
    isRequiredLogin: false,
    bg: '',
    label: {
      text: '',
      color: '',
    },
  };
};

export const getPlaceHolderLabel = (linkType: CTA_BUTTON_ACTION_TYPE): string => {
  switch (linkType) {
    case CTA_BUTTON_ACTION_TYPE.EXTERNAL_WEB:
      return '버튼 랜딩 URL을 입력하세요.';
    case CTA_BUTTON_ACTION_TYPE.SHOWROOM:
      return '랜딩 시킬 쇼룸 코드를 입력하세요.';
    case CTA_BUTTON_ACTION_TYPE.COUPON:
      return '제공할 쿠폰ID를 입력하세요.';
    case CTA_BUTTON_ACTION_TYPE.CONTENT_STORY:
      return '랜딩 시킬 콘텐츠(스토리) 코드를 입력하세요.';
    case CTA_BUTTON_ACTION_TYPE.CONTENT_TEASER:
      return '랜딩 시킬 콘텐츠(라이브티저) 코드를 입력하세요.';
    case CTA_BUTTON_ACTION_TYPE.DEEP_LINK:
      return '랜딩 시킬 인앱 딥링크를 입력하세요.';
    default:
      return '';
  }
};
