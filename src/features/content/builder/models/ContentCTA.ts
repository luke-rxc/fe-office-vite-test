import {
  ALIGN_TYPE,
  BOOLEAN_VALUE_TYPE,
  CONTENT_BACKGROUND_TYPE,
  CTA_BUTTON_ACTION_TYPE,
  CTA_BUTTON_STYLE_TYPE,
  CTA_BUTTON_TOP_SPACING,
  CTA_BUTTON_TYPE,
  LAYOUT_DIRECTION_TYPE,
} from '../constants';
import { getFormMediaInfo, getInitMediaContent, getInitCTAButton, getMediaFileType } from '../utils';
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
export type DisplayContentCTAModel = {
  direction: LAYOUT_DIRECTION_TYPE;
  buttonTopSpacing: CTA_BUTTON_TOP_SPACING;
  buttonStyle: CTA_BUTTON_STYLE_TYPE;
  buttonTextAlign: Omit<ALIGN_TYPE, 'RIGHT'>;
  textEffect: boolean; // 텍스트 모션 효과 사용여부
  title: Omit<TextItemModel, 'sizeType'>; // 타이틀
  subTitle: Omit<TextItemModel, 'sizeType'>; // 서브 타이틀
  description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  isOverlay: boolean; // 백그라운드 딤드
  align: ALIGN_TYPE; // 텍스트 정렬
  buttons: DisplayCtaButtonModel[]; // 버튼 리스트
  useDisplayDateTime: boolean; // 노출기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentCTAModel = {
  direction: LAYOUT_DIRECTION_TYPE;
  buttonTopSpacing: CTA_BUTTON_TOP_SPACING;
  buttonType: CTA_BUTTON_TYPE;
  textEffect: BOOLEAN_VALUE_TYPE; // 텍스트 모션 효과 사용여부
  title: Omit<FormContentTextItemModel, 'sizeType'>; // 타이틀
  subTitle: Omit<FormContentTextItemModel, 'sizeType'>; // 서브타이틀
  description: Omit<FormContentTextItemModel, 'sizeType'>; // 디스크립션
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  isOverlay: boolean; // 백그라운드 딤드
  align: ALIGN_TYPE; // 텍스트 정렬
  buttons: FormContentCtaButtonModel[]; // 버튼 리스트
  useDisplayDateTime: boolean; // 노출 기간 설정 사용여부
  displayStartDateTime: string; // 노출 시작 시간
  displayEndDateTime: string; // 노출 종료 시간
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentCTAUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentCTA = (): DisplayContentCTAModel => {
  return {
    direction: LAYOUT_DIRECTION_TYPE.HORIZONTAL,
    buttonTopSpacing: CTA_BUTTON_TOP_SPACING.NORMAL,
    buttonStyle: CTA_BUTTON_STYLE_TYPE.FILL,
    buttonTextAlign: ALIGN_TYPE.CENTER,
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
    isOverlay: false,
    align: ALIGN_TYPE.LEFT,
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.MEDIA,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
    buttons: [],
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
export const initFormCTA = (
  contents: DisplayContentCTAModel,
): {
  contents: FormContentCTAModel;
  mediaUploader: FormContentCTAUploaderModel;
} => {
  const initValue = initDisplayContentCTA();
  const {
    direction,
    buttonTopSpacing,
    buttonStyle,
    buttonTextAlign,
    textEffect,
    title,
    subTitle,
    description,
    backgroundInfo,
    backgroundMedia,
    isOverlay,
    align,
    buttons,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = {
    ...initValue,
    ...contents,
  };
  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어

  const formValue = {
    contents: {
      direction,
      buttonTopSpacing,
      buttonType: getStyleButtonType(buttonStyle, buttonTextAlign),
      align,
      textEffect: textEffect ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      title,
      subTitle,
      description,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      isOverlay,
      buttons: getFormButtonList(buttons),
      useDisplayDateTime,
      displayStartDateTime,
      displayEndDateTime,
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
export const getSubmitContentCTA = (formValue: ContentFormModel): DisplayContentCTAModel => {
  const {
    direction,
    buttonTopSpacing,
    buttonType,
    textEffect,
    title,
    subTitle,
    description,
    backgroundType,
    backgroundColor,
    backgroundMedia,
    isOverlay,
    align,
    buttons,
    useDisplayDateTime,
    displayStartDateTime,
    displayEndDateTime,
  } = formValue.contents as FormContentCTAModel;

  const buttonStyle = getButtonStyle(buttonType);
  const submitValue = {
    direction,
    buttonTopSpacing,
    buttonStyle,
    buttonTextAlign: getButtonTextAlign(buttonType),
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
    buttons: getButtonList(buttons, direction, buttonStyle),
    useDisplayDateTime,
    displayStartDateTime: !useDisplayDateTime ? '' : displayStartDateTime,
    displayEndDateTime: !useDisplayDateTime ? '' : displayEndDateTime,
  };
  return submitValue;
};

const getStyleButtonType = (style: CTA_BUTTON_STYLE_TYPE, align: Omit<ALIGN_TYPE, 'RIGHT'>): CTA_BUTTON_TYPE => {
  if (style === CTA_BUTTON_STYLE_TYPE.FILL) {
    if (align === ALIGN_TYPE.LEFT) {
      return CTA_BUTTON_TYPE.FILL_LEFT;
    } else if (align === ALIGN_TYPE.CENTER) {
      return CTA_BUTTON_TYPE.FILL_CENTER;
    }
  } else if (style === CTA_BUTTON_STYLE_TYPE.OUTLINE) {
    if (align === ALIGN_TYPE.LEFT) {
      return CTA_BUTTON_TYPE.OUTLINE_LEFT;
    } else if (align === ALIGN_TYPE.CENTER) {
      return CTA_BUTTON_TYPE.OUTLINE_CENTER;
    }
  }
  return CTA_BUTTON_TYPE.NONE;
};

/**
 * 버튼 스타일 모양 값 조회
 * @param buttonType
 * @returns
 */
const getButtonStyle = (buttonType: CTA_BUTTON_TYPE): CTA_BUTTON_STYLE_TYPE => {
  if (buttonType === CTA_BUTTON_TYPE.FILL_CENTER || buttonType === CTA_BUTTON_TYPE.FILL_LEFT) {
    return CTA_BUTTON_STYLE_TYPE.FILL;
  } else {
    return CTA_BUTTON_STYLE_TYPE.OUTLINE;
  }
};

/**
 * 버튼 텍스트 정렬값 조회
 * @param buttonType
 * @returns
 */
const getButtonTextAlign = (buttonType: CTA_BUTTON_TYPE): ALIGN_TYPE => {
  if (buttonType === CTA_BUTTON_TYPE.FILL_CENTER || buttonType === CTA_BUTTON_TYPE.OUTLINE_CENTER) {
    return ALIGN_TYPE.CENTER;
  } else {
    return ALIGN_TYPE.LEFT;
  }
};

/**
 * 폼 버튼 리스트
 * @param buttons
 * @returns
 */
const getFormButtonList = (buttons: DisplayCtaButtonModel[]): FormContentCtaButtonModel[] => {
  if (buttons.length === 0) {
    return [{ ...getInitCTAButton() }];
  }
  const buttonList = buttons.map((button) => {
    const { buttonActionType, value, bg = '', color = '', label = '', isRequiredLogin = false } = button;
    return {
      buttonActionType,
      value,
      isRequiredLogin,
      bg,
      label: {
        text: label,
        color,
      },
    };
  });

  return buttonList;
};

/**
 * 버튼 리스트
 * @param buttons
 * @returns
 */
const getButtonList = (
  buttons: FormContentCtaButtonModel[],
  direction: LAYOUT_DIRECTION_TYPE,
  buttonStyle: CTA_BUTTON_STYLE_TYPE,
): DisplayCtaButtonModel[] => {
  const buttonList = buttons.map((button) => {
    const { buttonActionType, value, bg = '', label, isRequiredLogin = false } = button;
    return {
      buttonActionType,
      value,
      isRequiredLogin: buttonActionType === CTA_BUTTON_ACTION_TYPE.EXTERNAL_WEB ? isRequiredLogin : false,
      bg: buttonStyle === CTA_BUTTON_STYLE_TYPE.FILL ? bg : '',
      color: label.color,
      label: label.text,
    };
  });

  return buttonList;
};

/**
 * 디스플레이 버튼
 */
export type DisplayCtaButtonModel = {
  buttonActionType: CTA_BUTTON_ACTION_TYPE;
  value: string;
  isRequiredLogin: boolean;
  bg: string;
  color: string;
  label: string;
};
export type FormContentCtaButtonModel = {
  buttonActionType: CTA_BUTTON_ACTION_TYPE;
  value: string;
  isRequiredLogin: boolean;
  bg: string;
  label: ButtonLabelModel;
};

export type ButtonLabelModel = Omit<TextItemModel, 'sizeType' | 'bold'>;
