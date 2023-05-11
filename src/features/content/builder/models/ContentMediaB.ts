import { ALIGN_TYPE, BOOLEAN_VALUE_TYPE, CONTENT_BACKGROUND_TYPE, TEXT_ITEM_SIZE_TYPE } from '../constants';
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
export type DisplayContentMediaBModel = {
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  isOverlay: boolean; // 백그라운드 딤드
  frontImage: DisplayMediaModel; // front 이미지 (모션적용)
  middleImage: DisplayMediaModel; // 오브젝트 이미지 (고정)
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: boolean; // 텍스트 모션 효과 사용여부
  title: TextItemModel; // 타이틀
  subTitle: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀
  description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
  isVideoScrollPlay: boolean; // 비디오 스크롤 재생
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentMediaBModel = {
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  isOverlay: boolean; // 백그라운드 딤드
  frontImage: FormContentMediaModel; // front 이미지 (모션적용)
  middleImage: FormContentMediaModel; // 오브젝트 이미지 (고정)
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: BOOLEAN_VALUE_TYPE; // 텍스트 모션 효과 사용여부
  title: FormContentTextItemModel; // 타이틀
  subTitle: FormContentTextItemModel; // 서브타이틀
  description: FormContentTextItemModel; // 서브타이틀
  isVideoScrollPlay: boolean; // 비디오 스크롤 재생
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentMediaBUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
  frontImage: FormContentMediaUploadModel;
  middleImage: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentMediaB = (): DisplayContentMediaBModel => {
  return {
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.MEDIA,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
    isOverlay: true,
    frontImage: { ...getInitMediaContent() },
    middleImage: { ...getInitMediaContent() },
    align: ALIGN_TYPE.LEFT,
    textEffect: true,
    title: {
      text: '',
      bold: true,
      color: '',
      sizeType: TEXT_ITEM_SIZE_TYPE.LARGE,
    },
    subTitle: {
      text: '',
      bold: true,
      color: '',
    },
    description: {
      text: '',
      bold: false,
      color: '',
    },
    isVideoScrollPlay: true,
    useDisplayDateTime: false,
    displayStartDateTime: '',
    displayEndDateTime: '',
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContent를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormMediaB = (
  contents: DisplayContentMediaBModel,
): {
  contents: FormContentMediaBModel;
  mediaUploader: FormContentMediaBUploaderModel;
} => {
  const initValue = initDisplayContentMediaB();
  const {
    backgroundInfo,
    backgroundMedia,
    isOverlay,
    frontImage,
    middleImage,
    align,
    textEffect,
    title,
    subTitle,
    description,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = {
    ...initValue,
    ...contents,
  };

  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드이미지
  const { mediaContents: frontImageContent, mediaUploader: frontImageUploader } = getFormMediaInfo(frontImage); // 프론트 이미지
  const { mediaContents: middleImageContent, mediaUploader: middleImageUploader } = getFormMediaInfo(middleImage); // 중앙 이미지

  const formValue = {
    contents: {
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      isOverlay,
      frontImage: frontImageContent as FormContentMediaModel,
      middleImage: middleImageContent as FormContentMediaModel,
      align,
      textEffect: textEffect ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      title,
      subTitle,
      description,
      isVideoScrollPlay,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    },
    mediaUploader: {
      backgroundMedia: backgroundMediaUploader as FormContentMediaUploadModel,
      frontImage: frontImageUploader as FormContentMediaUploadModel,
      middleImage: middleImageUploader as FormContentMediaUploadModel,
    },
  };
  return formValue;
};

/**
 * submit 시 Display Data를 bypass 하기 위해 폼 정보를 대상으로 display contents 정의
 * @param formValue
 * @returns
 */
export const getSubmitContentMediaB = (formValue: ContentFormModel): DisplayContentMediaBModel => {
  const {
    backgroundType,
    backgroundColor,
    backgroundMedia,
    isOverlay,
    frontImage,
    middleImage,
    align,
    textEffect,
    title,
    subTitle,
    description,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue.contents as FormContentMediaBModel;

  return {
    backgroundInfo: {
      type: backgroundType,
      color: backgroundType === CONTENT_BACKGROUND_TYPE.COLOR ? backgroundColor : '',
    },
    backgroundMedia:
      backgroundType === CONTENT_BACKGROUND_TYPE.MEDIA
        ? {
            ...backgroundMedia,
            type: getMediaFileType(backgroundMedia),
          }
        : { ...getInitMediaContent() },
    isOverlay: backgroundType === CONTENT_BACKGROUND_TYPE.MEDIA ? isOverlay : false,
    frontImage,
    middleImage,
    align,
    textEffect: textEffect === BOOLEAN_VALUE_TYPE.T,
    title,
    subTitle,
    description,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
};
