import { CONTENT_TYPE, CONTENT_STATUS_TYPE } from '../constants';
import { ContentDefaultSchema } from '../schemas';
import { ComboItemModel } from './ComboList';

/**
 * 기본정보 관리
 */
export type ContentDefaultModel = {
  providerId: number; // 입점사 id
  showRoomId: 1; // 쇼룸ID
  showRoomName: string; // 쇼룸명
  type: CONTENT_TYPE; // 콘텐츠 타입
  name: string; // 콘텐츠 명
  code: string; // 콘텐츠 코드
  id: number; // 콘텐츠 id
  status: CONTENT_STATUS_TYPE; // 공개타입
  keywords: { id: number; name: string }[]; // 키워드
  publicStartDate: number; // 공개기간 시작일
  publicEndDate: number; // 공개기간 종료일
  primaryImage: {
    extension: string;
    height: number;
    id: number;
    path: string;
    width: number;
  } | null;
};

/**
 * 기본정보 폼 모델
 */
export type ContentDefaultFieldModel = {
  adminUserId: number;
  providerId: ComboItemModel;
  showRoomId: ComboItemModel;
  keywordIds: ComboItemModel[];
  code: string; // 콘텐츠 코드
  isValidCode: boolean;
  name: string; // 콘텐츠 명
  isValidName: boolean;
  publicStartDate: string;
  publicEndDate: string;
  noEndDate: boolean;
  status: string;
  primaryImage: number;
};

/**
 * request params
 */
export type ContentDefaultRequestParams = {
  code: string;
  keywordIds: number[];
  name: string;
  showRoomId: number;
  publicEndDate: number;
  publicStartDate: number;
  status: string;
  primaryImageId: number;
};

export const toContentDefaultModel = (data: ContentDefaultSchema): ContentDefaultModel => {
  const {
    providerId,
    showRoomId,
    showRoomName,
    type,
    name,
    code,
    id,
    status,
    keywords,
    publicStartDate,
    publicEndDate,
    primaryImage,
  } = data;
  return {
    providerId,
    showRoomId,
    showRoomName,
    type,
    name,
    code,
    id,
    status,
    keywords,
    publicStartDate,
    publicEndDate,
    primaryImage,
  };
};

/**
 * to request Params
 */
export const toContentDefaultParams = (formValue: ContentDefaultFieldModel): ContentDefaultRequestParams => {
  const {
    adminUserId,
    showRoomId,
    keywordIds,
    code,
    name,
    status,
    publicStartDate,
    publicEndDate,
    noEndDate,
    primaryImage,
  } = formValue;
  const submitValue = {
    adminUserId,
    code,
    keywordIds: keywordIds.map((keyword) => keyword.value as number),
    name,
    showRoomId: showRoomId?.value as number,
    publicStartDate: publicStartDate ? new Date(publicStartDate).getTime() : null,
    publicEndDate: noEndDate ? null : new Date(publicEndDate).getTime(),
    status,
    primaryImageId: primaryImage,
  };
  return submitValue;
};
