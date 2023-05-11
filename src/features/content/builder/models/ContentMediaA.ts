import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  TEXT_ITEM_SIZE_TYPE,
  VERTICAL_ALIGN_TYPE,
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
export type DisplayContentMediaAModel = {
  align: ALIGN_TYPE; // 가로 정렬
  verticalAlign: VERTICAL_ALIGN_TYPE; // 세로 정렬
  mainImage: DisplayMediaModel; // 메인이미지  정보
  textEffect: boolean; // 텍스트 모션 효과 사용여부
  title: TextItemModel; // 타이틀
  subTitle: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀
  description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 미디어 정보
  parallaxMode: boolean; // 패럴럭스 모드(sticky타입)
  isOverlay: boolean; // 백그라운드 딤드
  isVideoScrollPlay: boolean; // 비디오 스크롤 재생
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentMediaAModel = {
  align: ALIGN_TYPE; // 가로 정렬
  verticalAlign: VERTICAL_ALIGN_TYPE; // 세로 정렬
  mainImage: FormContentMediaModel; // 메인이미지
  textEffect: BOOLEAN_VALUE_TYPE; // 텍스트 효과
  title: FormContentTextItemModel; // 타이틀
  subTitle: FormContentTextItemModel; // 서브타이틀
  description: FormContentTextItemModel; // 서브타이틀
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  parallaxMode: BOOLEAN_VALUE_TYPE; // 미디어 라운드 설정
  isOverlay: boolean; // 백그라운드 딤드
  isVideoScrollPlay: boolean; // 비디오 스크롤 재생
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentMediaAUploaderModel = {
  mainImage: FormContentMediaUploadModel;
  backgroundMedia: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentMediaA = (): DisplayContentMediaAModel => {
  return {
    align: ALIGN_TYPE.LEFT,
    verticalAlign: VERTICAL_ALIGN_TYPE.TOP, // 상단 정렬
    mainImage: { ...getInitMediaContent() },
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
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.MEDIA,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
    parallaxMode: true,
    isOverlay: true,
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
export const initFormMediaA = (
  contents: DisplayContentMediaAModel,
): {
  contents: FormContentMediaAModel;
  mediaUploader: FormContentMediaAUploaderModel;
} => {
  const initValue = initDisplayContentMediaA();
  const {
    align,
    verticalAlign,
    mainImage,
    textEffect,
    title,
    subTitle,
    description,
    backgroundInfo,
    backgroundMedia,
    parallaxMode,
    isOverlay,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = {
    ...initValue,
    ...contents,
  };

  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: mainImageContent, mediaUploader: mainImageUploader } = getFormMediaInfo(mainImage); // 메인이미지
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어

  const formValue = {
    contents: {
      align,
      verticalAlign,
      mainImage: mainImageContent as FormContentMediaModel,
      textEffect: textEffect ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      title,
      subTitle,
      description,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      parallaxMode: parallaxMode ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      isOverlay,
      isVideoScrollPlay,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    },
    mediaUploader: {
      mainImage: mainImageUploader as FormContentMediaUploadModel,
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
export const getSubmitContentMediaA = (formValue: ContentFormModel): DisplayContentMediaAModel => {
  const {
    align,
    backgroundType,
    backgroundColor,
    verticalAlign,
    mainImage,
    textEffect,
    title,
    subTitle,
    description,
    backgroundMedia,
    parallaxMode,
    isOverlay,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue.contents as FormContentMediaAModel;

  const submitValue = {
    align,
    verticalAlign,
    mainImage,
    textEffect: textEffect === BOOLEAN_VALUE_TYPE.T,
    title,
    subTitle,
    description,
    backgroundInfo: {
      type: backgroundType,
      color: backgroundType === CONTENT_BACKGROUND_TYPE.COLOR ? backgroundColor : '',
    },
    backgroundMedia: {
      ...backgroundMedia,
      type: getMediaFileType(backgroundMedia),
    },
    parallaxMode: parallaxMode === BOOLEAN_VALUE_TYPE.T,
    isOverlay,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
  return submitValue;
};
