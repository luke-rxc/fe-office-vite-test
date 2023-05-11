import { IMAGE_VIEWER_ACTION_TYPE } from '../constants';

export const getImageActionPlaceHolderLabel = (actionType: IMAGE_VIEWER_ACTION_TYPE): string => {
  switch (actionType) {
    case IMAGE_VIEWER_ACTION_TYPE.GOODS:
      return '상품 ID를 입력해주세요';
    case IMAGE_VIEWER_ACTION_TYPE.SHOWROOM:
      return '쇼룸 코드를 입력해주세요';
    case IMAGE_VIEWER_ACTION_TYPE.CONTENT_STORY:
      return '콘텐츠 코드를 입력해주세요';
    case IMAGE_VIEWER_ACTION_TYPE.CONTENT_TEASER:
      return '콘텐츠 코드를 입력해주세요';
    default:
      return '';
  }
};
