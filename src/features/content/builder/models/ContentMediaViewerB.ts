import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  MEDIA_VIEW_RATIO,
  MEDIA_VIEW_RATIO_TYPE,
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
export type DisplayContentMediaViewerBModel = {
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: boolean; // 텍스트 모션 효과 사용여부
  title: Omit<TextItemModel, 'sizeType'>; // 타이틀
  subTitle: Omit<TextItemModel, 'sizeType'>; // 서브타이틀
  description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  isOverlay: boolean; // 백그라운드 이미지 딤드
  mediaViewRatio: MEDIA_VIEW_RATIO | null; // 미디어 노출 비율 정보
  isMediaRound: boolean; // 미디어 라운드 처리
  mediaLists: MediaViewerBMediaListItem[];
  useMediaText: boolean; // 미디어 텍스트 사용여부
  mediaTextColor: string; // 미디어 텍스트 컬러
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentMediaViewerBModel = {
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: BOOLEAN_VALUE_TYPE; // 텍스트 모션 효과 사용여부
  title: Omit<FormContentTextItemModel, 'sizeType'>; // 타이틀
  subTitle: Omit<FormContentTextItemModel, 'sizeType'>; // 서브타이틀
  description: Omit<FormContentTextItemModel, 'sizeType'>; // 디스크립션
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  isOverlay: boolean; // 백그라운드 이미지 딤드
  mediaViewRatioType: MEDIA_VIEW_RATIO_TYPE; // 미디어 노출 비율 타입
  isMediaRound: BOOLEAN_VALUE_TYPE; // 미디어 라운드 처리
  mainMedia: FormContentMediaModel; // 대표 미디어
  subMediaList: FormContentMediaModel[]; // 추가 미디어
  mainMediaTitle: TitleListModel; // 대표 미디어 타이틀 정보
  subMediaTitleList: TitleListModel[]; // 부가 미디어 타이틀 정보
  useMediaText: boolean; // 미디어 텍스트 사용여부
  mediaTextColor: string; // 미디어 텍스트 컬러
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentMediaViewerBUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
  mainMedia: FormContentMediaUploadModel;
  subMediaList: FormContentMediaUploadModel[];
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentsMediaViewerB = (): DisplayContentMediaViewerBModel => {
  return {
    align: ALIGN_TYPE.LEFT,
    textEffect: true,
    title: {
      text: '',
      bold: true,
      color: '',
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
    isOverlay: true,
    mediaViewRatio: MEDIA_VIEW_RATIO.SQUARE,
    isMediaRound: true,
    mediaLists: [],
    useMediaText: true,
    mediaTextColor: '',
    useDisplayDateTime: false,
    displayStartDateTime: '',
    displayEndDateTime: '',
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContents를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormMediaViewerB = (
  contents: DisplayContentMediaViewerBModel,
): {
  contents: FormContentMediaViewerBModel;
  mediaUploader: FormContentMediaViewerBUploaderModel;
} => {
  const initValue = initDisplayContentsMediaViewerB();
  const {
    align,
    textEffect,
    title,
    subTitle,
    description,
    backgroundInfo,
    backgroundMedia,
    isOverlay,
    mediaViewRatio,
    isMediaRound,
    mediaLists,
    useMediaText,
    mediaTextColor,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = { ...initValue, ...contents };
  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어
  // 미디어 노출 비율 타입 조회
  const mediaViewRatioType = getMediaViewRatioType(mediaViewRatio);

  // 대표 이미지
  const { mediaContents: mainMediaContent, mediaUploader: mainMediaUploaderList } = getFormMediaInfo(
    mediaLists.length > 0 ? mediaLists[0] : undefined,
  );

  // 추가 이미지
  const { mediaContents: subMediaList, mediaUploader: subMediaUploaderList } = getFormMediaInfo(
    mediaLists.length > 1 ? mediaLists.slice(1) : [],
  );

  // 대표 타이틀
  let mainMediaTitle: TitleListModel;
  if (mediaLists.length > 0) {
    const { title, subTitle } = mediaLists[0];
    mainMediaTitle = {
      title,
      subTitle,
    };
  } else {
    mainMediaTitle = {
      title: '',
      subTitle: '',
    };
  }

  // 서브 타이틀 리스트
  const subList = mediaLists.length > 1 ? mediaLists.slice(1) : [];
  const subMediaTitleList = subList.map((mediaInfo) => {
    const { title, subTitle } = mediaInfo;
    return {
      title,
      subTitle,
    };
  });

  const formValue = {
    contents: {
      align,
      textEffect: textEffect ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      title,
      subTitle,
      description,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      isOverlay,
      mediaViewRatioType,
      isMediaRound: isMediaRound ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      mainMedia: mainMediaContent as FormContentMediaModel,
      subMediaList: subMediaList as FormContentMediaModel[],
      mainMediaTitle,
      subMediaTitleList,
      useMediaText,
      mediaTextColor,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    },
    mediaUploader: {
      backgroundMedia: backgroundMediaUploader as FormContentMediaUploadModel,
      mainMedia: mainMediaUploaderList as FormContentMediaUploadModel,
      subMediaList: subMediaUploaderList as FormContentMediaUploadModel[],
    },
  };
  return formValue;
};

/**
 * submit 시 Display Data를 bypass 하기 위해 폼 정보를 대상으로 display contents 정의
 * @param formValue
 * @returns
 */
export const getSubmitContentMediaViewerB = (formValue: ContentFormModel): DisplayContentMediaViewerBModel => {
  const {
    align,
    textEffect,
    title,
    subTitle,
    description,
    backgroundType,
    backgroundColor,
    backgroundMedia,
    isOverlay,
    mediaViewRatioType,
    isMediaRound,
    mainMedia,
    subMediaList,
    mainMediaTitle,
    subMediaTitleList,
    useMediaText,
    mediaTextColor,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue.contents as FormContentMediaViewerBModel;
  const mediaLists = [mainMedia, ...(subMediaList ? subMediaList : [])].map((media: FormContentMediaModel, index) => {
    return {
      ...media,
      type: getMediaFileType(media),
      title: useMediaText ? (index === 0 ? mainMediaTitle.title : subMediaTitleList[index - 1].title) : '',
      subTitle: useMediaText ? (index === 0 ? mainMediaTitle.subTitle : subMediaTitleList[index - 1].subTitle) : '',
    };
  });

  const submitValue = {
    align,
    textEffect: textEffect === BOOLEAN_VALUE_TYPE.T,
    title,
    subTitle,
    description,
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
    mediaViewRatio: getMediaViewRatio(mediaViewRatioType),
    isMediaRound: isMediaRound === BOOLEAN_VALUE_TYPE.T,
    mediaLists,
    useMediaText,
    mediaTextColor: useMediaText ? mediaTextColor : '',
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
  return submitValue;
};

export type MediaViewerBMediaListItem = DisplayMediaModel & {
  title: string;
  subTitle: string;
};

export type TitleListModel = {
  title: string;
  subTitle: string;
};
