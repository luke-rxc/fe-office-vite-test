import {
  MEDIA_VIEWER_A_INDICATOR_TYPE,
  MEDIA_VIEWER_A_OVERLAY_TYPE,
  MEDIA_VIEW_RATIO,
  MEDIA_VIEW_RATIO_TYPE,
} from '../constants';
import { getFormMediaInfo, getMediaFileType, getMediaViewRatio, getMediaViewRatioType } from '../utils';
import { ContentFormModel, DisplayMediaModel, FormContentMediaModel, FormContentMediaUploadModel } from './Content';

/**
 * display Data -> 프론트로 bypass 되는 형태
 */
export type DisplayContentMediaViewerAModel = {
  mediaViewRatio: MEDIA_VIEW_RATIO | null; // 미디어 노출 비율 정보
  mediaLists: DisplayMediaModel[];
  controller: MediaViewControllerModel;
  indicatorType: MEDIA_VIEWER_A_INDICATOR_TYPE; // 인디케이터 타입
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentMediaViewerAModel = {
  mediaViewRatioType: MEDIA_VIEW_RATIO_TYPE; // 미디어 노출 비율 타입
  mainMedia: FormContentMediaModel; // 대표 미디어
  subMediaList: FormContentMediaModel[]; // 추가 미디어
  overlayType: MEDIA_VIEWER_A_OVERLAY_TYPE; // 오버레이 컬러 타입
  bulletColor: string; // 불릿 색상
  indicatorType: MEDIA_VIEWER_A_INDICATOR_TYPE; // 인디케이터 타입
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentMediaViewerAUploaderModel = {
  mainMedia: FormContentMediaUploadModel;
  subMediaList: FormContentMediaUploadModel[];
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentMediaViewerA = (): DisplayContentMediaViewerAModel => {
  return {
    mediaViewRatio: MEDIA_VIEW_RATIO.SQUARE,
    mediaLists: [],
    controller: {
      bulletColor: '',
      background: MEDIA_VIEWER_A_OVERLAY_TYPE.NONE,
    },
    indicatorType: MEDIA_VIEWER_A_INDICATOR_TYPE.NONE,
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
export const initFormMediaViewerA = (
  contents: DisplayContentMediaViewerAModel,
): {
  contents: FormContentMediaViewerAModel;
  mediaUploader: FormContentMediaViewerAUploaderModel;
} => {
  const initValue = initDisplayContentMediaViewerA();
  const {
    mediaViewRatio,
    mediaLists,
    controller,
    indicatorType,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = {
    ...initValue,
    ...contents,
  };

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
  const { background, bulletColor } = controller;

  const formValue = {
    contents: {
      mediaViewRatioType,
      mainMedia: mainMediaContent as FormContentMediaModel,
      subMediaList: subMediaList as FormContentMediaModel[],
      overlayType: background,
      bulletColor,
      indicatorType,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    },
    mediaUploader: {
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
export const getSubmitContentMediaViewerA = (formValue: ContentFormModel): DisplayContentMediaViewerAModel => {
  const {
    mediaViewRatioType,
    mainMedia,
    subMediaList,
    overlayType,
    bulletColor,
    indicatorType,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue.contents as FormContentMediaViewerAModel;
  const mediaLists = [mainMedia, ...(subMediaList ? subMediaList : [])].map((media: FormContentMediaModel) => {
    return {
      ...media,
      type: getMediaFileType(media),
    } as DisplayMediaModel;
  });
  const submitValue = {
    mediaViewRatio: getMediaViewRatio(mediaViewRatioType),
    mediaLists,
    controller: {
      background: overlayType,
      bulletColor,
    },
    indicatorType,
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
  return submitValue;
};

export type MediaViewControllerModel = {
  bulletColor: string; // 인디케이터 색상
  background: MEDIA_VIEWER_A_OVERLAY_TYPE; // 오버레이 색상타입
};
