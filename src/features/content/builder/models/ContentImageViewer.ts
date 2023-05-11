import { IMAGE_VIEWER_ACTION_TYPE } from '../constants';
import { getFormMediaInfo, getInitMediaContent } from '../utils';
import { ContentFormModel, DisplayMediaModel, FormContentMediaModel, FormContentMediaUploadModel } from './Content';

/**
 * display Data -> 프론트로 bypass 되는 형태
 */
export type DisplayContentImageViewerModel = {
  image: DisplayMediaModel; // 메인이미지  정보
  actions: ImageViewerActionModel; // 이미지 랜딩 액션
  useActions: boolean; // 랜딩 사용 여부
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentImageViewerModel = {
  image: FormContentMediaModel; // 메인이미지
  actions: ImageViewerActionModel; // 이미지 액션
  useActions: boolean; // 랜딩 설정 여부
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentImageViewerUploaderModel = {
  image: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentImageViewer = (): DisplayContentImageViewerModel => {
  return {
    image: { ...getInitMediaContent() },
    actions: {
      actionType: IMAGE_VIEWER_ACTION_TYPE.GOODS,
      value: '',
    },
    useActions: false,
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
export const initFormImageViewer = (
  contents: DisplayContentImageViewerModel,
): {
  contents: FormContentImageViewerModel;
  mediaUploader: FormContentImageViewerUploaderModel;
} => {
  const initValue = initDisplayContentImageViewer();
  const { image, actions, useActions, useDisplayDateTime, displayStartDateTime, displayEndDateTime } = {
    ...initValue,
    ...contents,
  };

  const { mediaContents: imageContent, mediaUploader: imageUploader } = getFormMediaInfo(image); // 메인이미지

  const formValue = {
    contents: {
      image: imageContent as FormContentMediaModel,
      actions: actions ?? {
        actionType: IMAGE_VIEWER_ACTION_TYPE.GOODS,
        value: '',
      },
      useActions,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    },
    mediaUploader: {
      image: imageUploader as FormContentMediaUploadModel,
    },
  };
  return formValue;
};

/**
 * submit 시 Display Data를 bypass 하기 위해 폼 정보를 대상으로 display contents 정의
 * @param formValue
 * @returns
 */
export const getSubmitContentImageViewer = (formValue: ContentFormModel): DisplayContentImageViewerModel => {
  const { image, actions, useActions, useDisplayDateTime, displayStartDateTime, displayEndDateTime } =
    formValue.contents as FormContentImageViewerModel;

  const submitValue = {
    image,
    actions: useActions ? actions : null,
    useActions,
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
  return submitValue;
};

/**
 * 이미지 액션
 */
export type ImageViewerActionModel = {
  actionType: IMAGE_VIEWER_ACTION_TYPE;
  value: string;
} | null;
