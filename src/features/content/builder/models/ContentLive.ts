import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  LIVE_OVERLAY_TYPE,
  LIVE_TIME_COLOR_TYPE,
} from '../constants';
import { getFormMediaInfo, getInitMediaContent, getMediaFileType } from '../utils';
import {
  BackgroundInfoModel,
  ContentFormModel,
  DisplayMediaModel,
  FormContentMediaModel,
  FormContentMediaUploadModel,
  FormContentTextItemModel,
  TextItemModel,
} from './Content';

/**
 * display Data -> 프론트로 bypass 되는 형태
 */
export type DisplayContentLiveModel = {
  align: ALIGN_TYPE; // 가로 정렬
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  textEffect: boolean; // 텍스트 모션 효과 사용여부
  title: TextItemModel; // 타이틀
  subTitle: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀
  overlayColor: LIVE_OVERLAY_TYPE;
  timeColor: LIVE_TIME_COLOR_TYPE;
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentLiveModel = {
  align: ALIGN_TYPE; // 가로 정렬
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  textEffect: BOOLEAN_VALUE_TYPE; // 텍스트 모션 효과 사용여부
  title: Omit<FormContentTextItemModel, 'sizeType'>; // 타이틀
  subTitle: Omit<FormContentTextItemModel, 'sizeType'>; // 서브타이틀
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  overlayColor: LIVE_OVERLAY_TYPE; // 딤드컬러
  timeColor: LIVE_TIME_COLOR_TYPE; // 시간(카운트다운) 컬러
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentLiveUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentLive = (): DisplayContentLiveModel => {
  return {
    align: ALIGN_TYPE.LEFT,
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.MEDIA,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
    textEffect: true,
    title: {
      text: '',
      bold: true,
      color: '',
    },
    subTitle: {
      text: '',
      bold: false,
      color: '',
    },
    overlayColor: LIVE_OVERLAY_TYPE.NONE,
    timeColor: LIVE_TIME_COLOR_TYPE.BLACK,
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContent를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormLive = (
  contents: DisplayContentLiveModel,
): {
  contents: FormContentLiveModel;
  mediaUploader: FormContentLiveUploaderModel;
} => {
  const initValue = initDisplayContentLive();
  const { align, backgroundMedia, backgroundInfo, timeColor, overlayColor, textEffect, title, subTitle } = {
    ...initValue,
    ...contents,
  };
  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어
  const formValue = {
    contents: {
      align,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      textEffect: textEffect ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      title,
      subTitle,
      backgroundType,
      backgroundColor,
      timeColor,
      overlayColor,
    },
    mediaUploader: {
      backgroundMedia: backgroundMediaUploader as FormContentMediaUploadModel,
    },
  };
  return formValue;
};

/**
 * submit 시 Display Data를 bypass 하기 위해 폼 정보를 대상으로 display contents 정의
 * @param formValue
 * @returns
 */
export const getSubmitContentLive = (formValue: ContentFormModel): DisplayContentLiveModel => {
  const {
    align,
    backgroundType,
    backgroundColor,
    backgroundMedia,
    overlayColor,
    timeColor,
    textEffect,
    title,
    subTitle,
  } = formValue.contents as FormContentLiveModel;

  const submitValue = {
    align,
    backgroundMedia: {
      ...backgroundMedia,
      type: getMediaFileType(backgroundMedia),
    },
    backgroundInfo: {
      type: backgroundType,
      color: backgroundType === CONTENT_BACKGROUND_TYPE.COLOR ? backgroundColor : '',
    },
    textEffect: textEffect === BOOLEAN_VALUE_TYPE.T,
    title,
    subTitle,
    overlayColor,
    timeColor,
  };
  return submitValue;
};
