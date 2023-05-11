import { BLANK_COLOR_TYPE, BLANK_SPACING_SIZE, BLANK_SPACING_TYPE } from '../constants';
import { ContentFormModel } from './Content';

/**
 * display Data -> 프론트로 bypass 되는 형태
 */
export type DisplayContentBlankModel = {
  height: number; // 여백 높이
  colors: string[]; // 배경 컬러
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentBlankModel = {
  height: number; // 높이 수치
  spacingType: BLANK_SPACING_TYPE; // 여백 높이 타입
  customHeight: number; // 사용자 지정 수치
  colorType: BLANK_COLOR_TYPE; // 색상타입
  colors: string[]; // 색상정보
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentBlankUploaderModel = {};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentBlank = (): DisplayContentBlankModel => {
  return {
    height: BLANK_SPACING_SIZE.SMALL,
    colors: [''],
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
export const initFormBlank = (
  contents: DisplayContentBlankModel,
): {
  contents: FormContentBlankModel;
  mediaUploader: FormContentBlankUploaderModel;
} => {
  const initValue = initDisplayContentBlank();
  const { height, colors, useDisplayDateTime, displayStartDateTime, displayEndDateTime } = {
    ...initValue,
    ...contents,
  };

  const formValue = {
    contents: {
      spacingType: getSpacingType(height),
      height: height ?? 0,
      customHeight: height ?? 0,
      colorType: colors.length > 1 ? BLANK_COLOR_TYPE.GRADIENT : BLANK_COLOR_TYPE.SINGLE,
      colors,
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
    },
    mediaUploader: {},
  };
  return formValue;
};

/**
 * submit 시 Display Data를 bypass 하기 위해 폼 정보를 대상으로 display contents 정의
 * @param formValue
 * @returns
 */
export const getSubmitContentBlank = (formValue: ContentFormModel): DisplayContentBlankModel => {
  const {
    height,
    spacingType,
    customHeight,
    colors,
    colorType,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue.contents as FormContentBlankModel;
  const colorValue = colorType === BLANK_COLOR_TYPE.SINGLE ? [colors[0]] : colors;

  const submitValue = {
    height: spacingType === BLANK_SPACING_TYPE.CUSTOM ? +customHeight : height,
    colors: colorValue,
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
  return submitValue;
};

/**
 * 높이값을 기준으로 초기 여백 높이에 대한 타입값 조회
 * @param ht
 * @returns
 */
const getSpacingType = (ht: number) => {
  switch (ht) {
    case BLANK_SPACING_SIZE.LARGE:
      return BLANK_SPACING_TYPE.LARGE;
    case BLANK_SPACING_SIZE.MEDIUM:
      return BLANK_SPACING_TYPE.MEDIUM;
    case BLANK_SPACING_SIZE.SMALL:
      return BLANK_SPACING_TYPE.SMALL;
    default:
      return BLANK_SPACING_TYPE.CUSTOM;
  }
};
