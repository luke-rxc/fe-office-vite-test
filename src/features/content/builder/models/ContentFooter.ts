import { CONTENT_BACKGROUND_TYPE } from '../constants';
import { getFormMediaInfo, getInitMediaContent } from '../utils';
import {
  BackgroundInfoModel,
  ContentFormModel,
  DisplayMediaModel,
  FormContentMediaModel,
  FormContentMediaUploadModel,
} from './Content';

/**
 * display Data -> 프론트로 bypass 되는 형태
 */
export type DisplayContentFooterModel = {
  color: string;
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  isOverlay: boolean; // 백그라운드 딤드
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentFooterModel = {
  color: string;
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  isOverlay: boolean; // 백그라운드 딤드
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentFooterUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentFooter = (): DisplayContentFooterModel => {
  return {
    color: '',
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.MEDIA,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
    isOverlay: true,
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContent를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormFooter = (
  contents: DisplayContentFooterModel,
): {
  contents: FormContentFooterModel;
  mediaUploader: FormContentFooterUploaderModel;
} => {
  const initValue = initDisplayContentFooter();
  const { color, backgroundInfo, backgroundMedia, isOverlay } = {
    ...initValue,
    ...contents,
  };
  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어
  const formValue = {
    contents: {
      color,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      isOverlay,
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
export const getSubmitContentFooter = (formValue: ContentFormModel): DisplayContentFooterModel => {
  const { color, backgroundType, backgroundColor, backgroundMedia, isOverlay } =
    formValue.contents as FormContentFooterModel;

  const submitValue = {
    color,
    backgroundInfo: {
      type: backgroundType,
      color: backgroundType === CONTENT_BACKGROUND_TYPE.COLOR ? backgroundColor : '',
    },
    backgroundMedia: backgroundType === CONTENT_BACKGROUND_TYPE.MEDIA ? backgroundMedia : { ...getInitMediaContent() },
    isOverlay: backgroundType === CONTENT_BACKGROUND_TYPE.MEDIA ? isOverlay : false,
  };
  return submitValue;
};
