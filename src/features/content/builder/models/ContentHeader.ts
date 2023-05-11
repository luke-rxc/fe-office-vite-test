import { CONTENT_BACKGROUND_TYPE, VERTICAL_ALIGN_TYPE } from '../constants';
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
export type DisplayContentHeaderModel = {
  verticalAlign: VERTICAL_ALIGN_TYPE; // 메인이미지 배치
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  logoImage: DisplayMediaModel; // 백그라운드 로고 이미지  정보
  mainImage: DisplayMediaModel; // 메인이미지  정보
  footerImage: DisplayMediaModel; // 하단 푸터이미지  정보
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentHeaderModel = {
  verticalAlign: VERTICAL_ALIGN_TYPE; // 메인이미지 배치
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  logoImage: FormContentMediaModel; // 로고이미지
  mainImage: FormContentMediaModel; // 메인이미지
  footerImage: FormContentMediaModel; // 푸터이미지
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentHeaderUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
  logoImage: FormContentMediaUploadModel;
  mainImage: FormContentMediaUploadModel;
  footerImage: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentHeader = (): DisplayContentHeaderModel => {
  return {
    verticalAlign: VERTICAL_ALIGN_TYPE.CENTER,
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.MEDIA,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
    logoImage: { ...getInitMediaContent() },
    mainImage: { ...getInitMediaContent() },
    footerImage: { ...getInitMediaContent() },
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContent를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormHeader = (
  contents: DisplayContentHeaderModel,
): {
  contents: FormContentHeaderModel;
  mediaUploader: FormContentHeaderUploaderModel;
} => {
  const initValue = initDisplayContentHeader();
  const { verticalAlign, backgroundInfo, backgroundMedia, logoImage, mainImage, footerImage } = {
    ...initValue,
    ...contents,
  };
  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어
  const { mediaContents: logoImageContent, mediaUploader: logoImageUploader } = getFormMediaInfo(logoImage); // 로고이미지
  const { mediaContents: mainImageContent, mediaUploader: mainImageUploader } = getFormMediaInfo(mainImage); // 메인이미지
  const { mediaContents: footerImageContent, mediaUploader: footerImageUploader } = getFormMediaInfo(footerImage); // 푸터 로고 이미지

  const formValue = {
    contents: {
      verticalAlign,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      logoImage: logoImageContent as FormContentMediaModel,
      mainImage: mainImageContent as FormContentMediaModel,
      footerImage: footerImageContent as FormContentMediaModel,
    },
    mediaUploader: {
      backgroundMedia: backgroundMediaUploader as FormContentMediaUploadModel,
      logoImage: logoImageUploader as FormContentMediaUploadModel,
      mainImage: mainImageUploader as FormContentMediaUploadModel,
      footerImage: footerImageUploader as FormContentMediaUploadModel,
    },
  };
  return formValue;
};

/**
 * submit 시 Display Data를 bypass 하기 위해 폼 정보를 대상으로 display contents 정의
 * @param formValue
 * @returns
 */
export const getSubmitContentHeader = (formValue: ContentFormModel): DisplayContentHeaderModel => {
  const { verticalAlign, backgroundType, backgroundColor, backgroundMedia, logoImage, mainImage, footerImage } =
    formValue.contents as FormContentHeaderModel;

  const submitValue = {
    verticalAlign,
    backgroundInfo: {
      type: backgroundType,
      color: backgroundType === CONTENT_BACKGROUND_TYPE.COLOR ? backgroundColor : '',
    },
    backgroundMedia: backgroundType === CONTENT_BACKGROUND_TYPE.MEDIA ? backgroundMedia : { ...getInitMediaContent() },
    logoImage,
    mainImage,
    footerImage,
  };
  return submitValue;
};
