import { ComboItemModel } from './ComboList';

/**
 * 콘텐츠 등록
 */
export type ContentCreatorFieldModel = {
  adminUserId: number;
  providerId: ComboItemModel;
  showRoomId: ComboItemModel;
  contentsType: ComboItemModel;
  keywordIds: ComboItemModel[];
  name: string; // 콘텐츠 명
  code: string; // 콘텐츠 코드
  isValidName: boolean; // 콘텐츠명 유효여부
  isValidCode: boolean; // 콘텐츠 코드 유효성
  primaryImageId: number; // 섬네일 이미지
};

/**
 * request params
 */
export type ContentCreatorRequestParams = {
  adminUserId: number;
  code: string;
  name: string;
  showRoomId: number;
  type: string;
  keywordIds: number[];
  primaryImageId: number;
};

export const toCreatorParams = (formValue: ContentCreatorFieldModel): ContentCreatorRequestParams => {
  const { adminUserId, showRoomId, contentsType, keywordIds, code, name, primaryImageId } = formValue;
  const submitValue = {
    adminUserId,
    name,
    code,
    showRoomId: showRoomId['value'] as number,
    type: contentsType['value'] as string,
    keywordIds: keywordIds.map((keyword) => keyword.value as number),
    primaryImageId,
  };
  return submitValue;
};
