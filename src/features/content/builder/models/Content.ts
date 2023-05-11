import type { UploadFileType } from '@services/useFileUploader';
import { CONTENT_BACKGROUND_TYPE, Preset, TEXT_ITEM_SIZE_TYPE } from '../constants';
import { ContentComponentModel } from './Common';

import {
  DisplayContentBlankModel,
  FormContentBlankModel,
  FormContentBlankUploaderModel,
  getSubmitContentBlank,
  initFormBlank,
} from './ContentBlank';
import {
  DisplayContentFooterModel,
  FormContentFooterModel,
  FormContentFooterUploaderModel,
  getSubmitContentFooter,
  initFormFooter,
} from './ContentFooter';
import {
  DisplayContentHeaderModel,
  FormContentHeaderModel,
  FormContentHeaderUploaderModel,
  getSubmitContentHeader,
  initFormHeader,
} from './ContentHeader';
import {
  DisplayContentMediaViewerAModel,
  FormContentMediaViewerAModel,
  FormContentMediaViewerAUploaderModel,
  getSubmitContentMediaViewerA,
  initFormMediaViewerA,
} from './ContentMediaViewerA';
import {
  DisplayContentTextModel,
  FormContentTextModel,
  FormContentTextUploaderModel,
  getSubmitContentText,
  initFormText,
} from './ContentText';
import {
  DisplayContentMediaViewerBModel,
  FormContentMediaViewerBModel,
  FormContentMediaViewerBUploaderModel,
  getSubmitContentMediaViewerB,
  initFormMediaViewerB,
} from './ContentMediaViewerB';
import {
  DisplayContentMediaAModel,
  FormContentMediaAModel,
  FormContentMediaAUploaderModel,
  getSubmitContentMediaA,
  initFormMediaA,
} from './ContentMediaA';
import {
  DisplayContentMediaBModel,
  FormContentMediaBModel,
  FormContentMediaBUploaderModel,
  getSubmitContentMediaB,
  initFormMediaB,
} from './ContentMediaB';
import {
  DisplayContentImageViewerModel,
  FormContentImageViewerModel,
  FormContentImageViewerUploaderModel,
  getSubmitContentImageViewer,
  initFormImageViewer,
} from './ContentImageViewer';
import {
  DisplayContentCTAModel,
  FormContentCTAModel,
  FormContentCTAUploaderModel,
  getSubmitContentCTA,
  initFormCTA,
} from './ContentCTA';
import {
  DisplayContentLiveModel,
  FormContentLiveModel,
  FormContentLiveUploaderModel,
  getSubmitContentLive,
  initFormLive,
} from './ContentLive';
import {
  DisplayContentDealAModel,
  FormContentDealAModel,
  FormContentDealAUploaderModel,
  getSubmitContentDealA,
  initFormDealA,
} from './ContentDealA';
import { GoodsModel, LiveModel } from './Common';
import {
  DisplayContentDealBModel,
  FormContentDealBModel,
  FormContentDealBUploaderModel,
  getSubmitContentDealB,
  initFormDealB,
} from './ContentDealB';
import {
  DisplayContentReplyModel,
  FormContentReplyModel,
  FormContentReplyUploaderModel,
  getSubmitContentReply,
  initFormReply,
} from './ContentReply';
import {
  DisplayContentLiveMultipleModel,
  FormContentLiveMultipleModel,
  FormContentLiveMultipleUploaderModel,
  getSubmitContentLiveMultiple,
  initFormLiveMultiple,
} from './ContentLiveMultiple';

/**
 * 컨텍스트로 관리할 콘텐츠 모델
 */
export type ContentModel = ContentComponentModel & {
  id: number;
  sortNum: number; // 정렬 순서
};

/**
 * 폼으로 관리할 콘텐츠 모델
 * - UI 화면 구성에 필요한 contents와 미디어 파일 업로드를 위한 mediaUploader로 구성
 */
export type ContentFormModel = {
  id: number;
  componentType: string; // 컴포넌트 타입
  goodsList: number[]; // 상품 정보
  liveList: number[]; // 라이브 정보
  contents: FormContentModel; //  폼 - 콘텐츠 화면 구성 정보
  mediaUploader: FormContentMediaUploader; // 폼 - 미디어업로드 정보
};

// 디스플레이 콘텐츠 타입
export type DisplayContentModel =
  | DisplayContentBlankModel
  | DisplayContentCTAModel
  | DisplayContentDealAModel
  | DisplayContentDealBModel
  | DisplayContentFooterModel
  | DisplayContentHeaderModel
  | DisplayContentImageViewerModel
  | DisplayContentLiveModel
  | DisplayContentLiveMultipleModel
  | DisplayContentMediaAModel
  | DisplayContentMediaBModel
  | DisplayContentMediaViewerAModel
  | DisplayContentMediaViewerBModel
  | DisplayContentReplyModel
  | DisplayContentTextModel;
// 폼 콘텐츠 타입
export type FormContentModel =
  | FormContentBlankModel
  | FormContentCTAModel
  | FormContentDealAModel
  | FormContentDealBModel
  | FormContentFooterModel
  | FormContentHeaderModel
  | FormContentImageViewerModel
  | FormContentLiveModel
  | FormContentLiveMultipleModel
  | FormContentMediaAModel
  | FormContentMediaBModel
  | FormContentMediaViewerAModel
  | FormContentMediaViewerBModel
  | FormContentReplyModel
  | FormContentTextModel;
// 폼 미디어업로더 타입
export type FormContentMediaUploader =
  | FormContentBlankUploaderModel
  | FormContentCTAUploaderModel
  | FormContentDealAUploaderModel
  | FormContentDealBUploaderModel
  | FormContentFooterUploaderModel
  | FormContentHeaderUploaderModel
  | FormContentImageViewerUploaderModel
  | FormContentLiveUploaderModel
  | FormContentLiveMultipleUploaderModel
  | FormContentMediaAUploaderModel
  | FormContentMediaBUploaderModel
  | FormContentMediaViewerAUploaderModel
  | FormContentMediaViewerBUploaderModel
  | FormContentReplyUploaderModel
  | FormContentTextUploaderModel;

/**
 * 컴포넌트 별 (display contents 정보를 기반으로) 폼 초기 데이터 구성
 * @param compType
 * @param content
 * @returns
 */
export const getInitFormValue = (
  compType: string,
  contents?: DisplayContentModel,
): {
  contents: FormContentModel;
  mediaUploader: FormContentMediaUploader;
} => {
  switch (compType) {
    case Preset.BLANK:
      return initFormBlank(contents as DisplayContentBlankModel);
    case Preset.CTA:
      return initFormCTA(contents as DisplayContentCTAModel);
    case Preset.DEAL_A:
      return initFormDealA(contents as DisplayContentDealAModel);
    case Preset.DEAL_B:
      return initFormDealB(contents as DisplayContentDealBModel);
    case Preset.FOOTER:
      return initFormFooter(contents as DisplayContentFooterModel);
    case Preset.HEADER:
      return initFormHeader(contents as DisplayContentHeaderModel);
    case Preset.IMAGE_VIEWER:
      return initFormImageViewer(contents as DisplayContentImageViewerModel);
    case Preset.LIVE:
      return initFormLive(contents as DisplayContentLiveModel);
    case Preset.LIVE_MULTIPLE:
      return initFormLiveMultiple(contents as DisplayContentLiveMultipleModel);
    case Preset.MEDIA_A:
      return initFormMediaA(contents as DisplayContentMediaAModel);
    case Preset.MEDIA_B:
      return initFormMediaB(contents as DisplayContentMediaBModel);
    case Preset.MEDIA_VIEWER_A:
      return initFormMediaViewerA(contents as DisplayContentMediaViewerAModel);
    case Preset.MEDIA_VIEWER_B:
      return initFormMediaViewerB(contents as DisplayContentMediaViewerBModel);
    case Preset.REPLY:
      return initFormReply(contents as DisplayContentReplyModel);
    case Preset.TEXT:
      return initFormText(contents as DisplayContentTextModel);
    default:
      break;
  }
};

/**
 * 폼 초기 라이브 id 리스트 구성
 */
export const getInitFormLiveList = (liveList: LiveModel[]): number[] => {
  return liveList.map((live) => live.id);
};

/**
 * 폼 초기 상품 id 리스트 구성
 */
export const getInitFormGoodsList = (goodsList: GoodsModel[]): number[] => {
  return goodsList.map((goods) => goods.goodsId);
};

/**
 * 폼데이터를 기반으로 submit contents 정보 구성
 */
export const getSubmitContent = (formValue: ContentFormModel): DisplayContentModel => {
  const { componentType } = formValue;
  switch (componentType) {
    case Preset.BLANK:
      return getSubmitContentBlank(formValue);
    case Preset.CTA:
      return getSubmitContentCTA(formValue);
    case Preset.DEAL_A:
      return getSubmitContentDealA(formValue);
    case Preset.DEAL_B:
      return getSubmitContentDealB(formValue);
    case Preset.FOOTER:
      return getSubmitContentFooter(formValue);
    case Preset.HEADER:
      return getSubmitContentHeader(formValue);
    case Preset.IMAGE_VIEWER:
      return getSubmitContentImageViewer(formValue);
    case Preset.LIVE:
      return getSubmitContentLive(formValue);
    case Preset.LIVE_MULTIPLE:
      return getSubmitContentLiveMultiple(formValue);
    case Preset.MEDIA_A:
      return getSubmitContentMediaA(formValue);
    case Preset.MEDIA_B:
      return getSubmitContentMediaB(formValue);
    case Preset.MEDIA_VIEWER_A:
      return getSubmitContentMediaViewerA(formValue);
    case Preset.MEDIA_VIEWER_B:
      return getSubmitContentMediaViewerB(formValue);
    case Preset.REPLY:
      return getSubmitContentReply(formValue);
    case Preset.TEXT:
      return getSubmitContentText(formValue);
    default:
      return undefined;
  }
};

/**
 * 디스플레이 content 미디어 모델
 * front bypass 전달
 */
export type DisplayMediaModel = {
  id: number;
  type: Omit<UploadFileType, 'ETC'>; // 이미지/비디오
  path: string;
  width: number;
  height: number;
  fileSize: number;
  extension: string;
  posterImage: string;
  blurHash: string;
};

/**
 * 폼데이터 contents 내 미디어 모델
 */
export type FormContentMediaModel = DisplayMediaModel;

/**
 * 폼데이터 mediaUploader 내 미디어 모델
 */
export type FormContentMediaUploadModel = {
  id: number | null;
  path: string;
  width: number;
  height: number;
  fileSize: number;
  extension: string;
  blurHash: string;
  file?: any;
  fileType?: Omit<UploadFileType, 'ETC'>;
};

/**
 * 파일 업로드 대상 리스트 항목
 */
export type MediaFileListModel = {
  id: number; // 매핑되는 컴포넌트 id
  componentType: string; // 매핑되는 컴포넌트 타입
  uploaderKey: string; // 매핑되는 업로드 폼 키 ex) [id].mediaUploader.[key].[index]
  key: string; // form 키 ex) [id].mediaUploader.[key].[index] 에서 key 값
  index: number | null; // form키 값이 배열인 경우 매핑되는 index 값
  file: any; // 업로드 할 파일
};

/**
 * 공통 텍스트 UI 모델
 */
export type TextItemModel = {
  text: string; // 텍스트 내용
  bold?: boolean; // bold 처리
  color?: string; // 텍스트 컬러
  sizeType?: TEXT_ITEM_SIZE_TYPE; // 텍스트 사이즈
};

export type FormContentTextItemModel = TextItemModel;

/**
 *  백그라운드 정보
 */
export type BackgroundInfoModel = {
  type: CONTENT_BACKGROUND_TYPE; // 배경 타입 - 미디어(이미지/비디오)/컬러
  color: string; // 배경색
};
