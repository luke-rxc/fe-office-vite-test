import { CONTENT_BACKGROUND_TYPE } from '../constants';
import { getFormMediaInfo, getInitMediaContent, getMediaFileType } from '../utils';
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
export type DisplayContentLiveMultipleModel = {
  useBackground: boolean; // 백그라운드 사용여부
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentLiveMultipleModel = {
  useBackground: boolean; // 백그라운드 사용여부
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentLiveMultipleUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentLiveMultiple = (): DisplayContentLiveMultipleModel => {
  return {
    useBackground: true,
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.COLOR,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContent를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormLiveMultiple = (
  contents: DisplayContentLiveMultipleModel,
): {
  contents: FormContentLiveMultipleModel;
  mediaUploader: FormContentLiveMultipleUploaderModel;
} => {
  const initValue = initDisplayContentLiveMultiple();
  const { useBackground, backgroundInfo, backgroundMedia } = {
    ...initValue,
    ...contents,
  };
  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어
  const formValue = {
    contents: {
      useBackground,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
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
export const getSubmitContentLiveMultiple = (formValue: ContentFormModel): DisplayContentLiveMultipleModel => {
  const { useBackground, backgroundType, backgroundColor, backgroundMedia } =
    formValue.contents as FormContentLiveMultipleModel;

  const submitValue = {
    useBackground,
    backgroundInfo: {
      type: useBackground ? backgroundType : CONTENT_BACKGROUND_TYPE.COLOR,
      color: useBackground && backgroundType === CONTENT_BACKGROUND_TYPE.COLOR ? backgroundColor : '',
    },
    backgroundMedia:
      useBackground && backgroundType === CONTENT_BACKGROUND_TYPE.MEDIA
        ? {
            ...backgroundMedia,
            type: getMediaFileType(backgroundMedia),
          }
        : { ...getInitMediaContent() },
  };
  return submitValue;
};
