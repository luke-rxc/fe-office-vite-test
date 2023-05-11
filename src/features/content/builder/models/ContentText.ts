import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  MEDIA_VIEW_RATIO,
  MEDIA_VIEW_RATIO_TYPE,
  TEXT_ITEM_SIZE_TYPE,
} from '../constants';
import {
  getFormMediaInfo,
  getInitMediaContent,
  getMediaFileType,
  getMediaViewRatio,
  getMediaViewRatioType,
} from '../utils';
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
export type DisplayContentTextModel = {
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: boolean; // 텍스트 모션 효과 사용여부
  title1: TextItemModel; // 타이틀1
  title2: TextItemModel; // 타이틀2
  subTitle1: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀1
  subTitle2: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀2
  subTitle3: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀3
  description: Omit<TextItemModel, 'sizeType'>[]; // 디스크립션
  useMedia: boolean; // 미디어 사용여부
  mediaViewRatio: MEDIA_VIEW_RATIO; // 미디어 노출 비율 정보
  isMediaRound: boolean; // 미디어 라운드 설정
  media: DisplayMediaModel; // 대표 미디어
  useBackground: boolean; // 백그라운드 사용여부
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  parallaxMode: boolean; // 패럴럭스 모드(sticky타입)
  isOverlay: boolean; // 백그라운드 딤드
  isVideoScrollPlay: boolean; // 비디오 스크롤 재생
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentTextModel = {
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: BOOLEAN_VALUE_TYPE; // 텍스트 모션 효과 사용여부
  title1: FormContentTextItemModel; // 타이틀1
  title2: FormContentTextItemModel; // 타이틀2
  subTitle1: Omit<FormContentTextItemModel, 'sizeType'>; // 서브타이틀1
  subTitle2: Omit<FormContentTextItemModel, 'sizeType'>; // 서브타이틀2
  subTitle3: Omit<FormContentTextItemModel, 'sizeType'>; // 서브타이틀3
  description: Omit<FormContentTextItemModel, 'sizeType'>[]; // 디스크립션
  useMedia: boolean; // 이미지/비디오 사용
  mediaViewRatioType: MEDIA_VIEW_RATIO_TYPE; // 미디어 노출 비율 타입
  isMediaRound: BOOLEAN_VALUE_TYPE; // 미디어 라운드 설정
  media: FormContentMediaModel; // 대표 미디어
  useBackground: boolean; // 백그라운드 사용여부
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  parallaxMode: boolean; // 패럴럭스 모드(sticky타입)
  isOverlay: boolean; // 백그라운드 딤드
  isVideoScrollPlay: boolean; // 비디오 스크롤 재생
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentTextUploaderModel = {
  media: FormContentMediaUploadModel; // 대표 미디어
  backgroundMedia: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentText = (): DisplayContentTextModel => {
  return {
    align: ALIGN_TYPE.LEFT,
    textEffect: true,
    title1: {
      text: '',
      bold: true,
      color: '',
      sizeType: TEXT_ITEM_SIZE_TYPE.MEDIUM,
    },
    title2: {
      text: '',
      bold: true,
      color: '',
      sizeType: TEXT_ITEM_SIZE_TYPE.MEDIUM,
    },
    subTitle1: {
      text: '',
      bold: false,
      color: '',
    },
    subTitle2: {
      text: '',
      bold: false,
      color: '',
    },
    subTitle3: {
      text: '',
      bold: false,
      color: '',
    },
    description: [],
    useMedia: true,
    mediaViewRatio: MEDIA_VIEW_RATIO.SQUARE,
    isMediaRound: true,
    media: { ...getInitMediaContent() },
    useBackground: true,
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
export const initFormText = (
  contents: DisplayContentTextModel,
): {
  contents: FormContentTextModel;
  mediaUploader: FormContentTextUploaderModel;
} => {
  const initValue = initDisplayContentText();
  const {
    align,
    textEffect,
    title1,
    title2,
    subTitle1,
    subTitle2,
    subTitle3,
    description,
    useMedia,
    mediaViewRatio,
    isMediaRound,
    media,
    useBackground,
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

  // 미디어 노출 비율 타입 조회
  const mediaViewRatioType = getMediaViewRatioType(mediaViewRatio);
  // 대표 미디어
  const { mediaContents: mediaContent, mediaUploader } = getFormMediaInfo(media);
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어

  const formValue = {
    contents: {
      align,
      textEffect: textEffect ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      title1,
      title2,
      subTitle1,
      subTitle2,
      subTitle3,
      description:
        description.length === 0
          ? [
              {
                text: '',
                bold: false,
                color: '',
              },
            ]
          : description,
      useMedia,
      mediaViewRatioType,
      isMediaRound: isMediaRound ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      media: mediaContent as FormContentMediaModel,
      useBackground,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      parallaxMode,
      isOverlay,
      isVideoScrollPlay,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    },
    mediaUploader: {
      media: mediaUploader as FormContentMediaUploadModel,
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
export const getSubmitContentText = (formValue: ContentFormModel): DisplayContentTextModel => {
  const {
    align,
    textEffect,
    title1,
    title2,
    subTitle1,
    subTitle2,
    subTitle3,
    description,
    useMedia,
    mediaViewRatioType,
    isMediaRound,
    media,
    useBackground,
    backgroundType,
    backgroundColor,
    backgroundMedia,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parallaxMode,
    isOverlay,
    isVideoScrollPlay,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue.contents as FormContentTextModel;

  const submitValue = {
    align,
    textEffect: textEffect === BOOLEAN_VALUE_TYPE.T,
    title1,
    title2,
    subTitle1,
    subTitle2,
    subTitle3,
    description: description.filter((desc) => desc.text),
    useMedia,
    mediaViewRatio: useMedia ? getMediaViewRatio(mediaViewRatioType) : MEDIA_VIEW_RATIO.SQUARE,
    isMediaRound: useMedia ? isMediaRound === BOOLEAN_VALUE_TYPE.T : false,
    media: useMedia
      ? {
          ...media,
          type: getMediaFileType(media),
        }
      : { ...getInitMediaContent() },
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
    parallaxMode: true, //useBackground ? parallaxMode : false,
    isOverlay: useBackground ? isOverlay : false,
    isVideoScrollPlay: useBackground ? isVideoScrollPlay : false,
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
  return submitValue;
};
