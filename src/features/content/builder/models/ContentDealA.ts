import { ALIGN_TYPE, BOOLEAN_VALUE_TYPE, CONTENT_BACKGROUND_TYPE, DEAL_A_COLUMN_TYPE } from '../constants';
import { getFormMediaInfo, getGoodsTextColor, getInitMediaContent, getMediaFileType } from '../utils';
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
export type DisplayContentDealAModel = {
  useText: boolean; // 텍스트 사용여부
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: boolean; // 텍스트 모션 효과 사용여부
  title: Omit<TextItemModel, 'sizeType'>; // 타이틀
  subTitle: Omit<TextItemModel, 'sizeType'>; // 서브타이틀
  description: Omit<TextItemModel, 'sizeType'>; // 디스크립션
  goodsColumnType: DEAL_A_COLUMN_TYPE; // 1/2단
  fillColumn: boolean; // 여백여부
  backgroundInfo: BackgroundInfoModel; // 백그라운드 정보
  backgroundMedia: DisplayMediaModel; // 백그라운드 이미지 정보
  isOverlay: boolean; // 백그라운드 이미지 딤드
  goodsColor: string; // 상품 정보 텍스트 색상
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentDealAModel = {
  useText: boolean; // 텍스트 사용여부
  align: ALIGN_TYPE; // 가로 정렬
  textEffect: BOOLEAN_VALUE_TYPE; // 텍스트 모션 효과 사용여부
  title: Omit<FormContentTextItemModel, 'sizeType'>; // 타이틀
  subTitle: Omit<FormContentTextItemModel, 'sizeType'>; // 서브타이틀
  description: Omit<FormContentTextItemModel, 'sizeType'>; // 디스크립션
  goodsColumnType: DEAL_A_COLUMN_TYPE; // 1/2단
  fillColumn: BOOLEAN_VALUE_TYPE; // 여백여부
  backgroundType: CONTENT_BACKGROUND_TYPE; // 백그라운드 타입
  backgroundColor: string; // 백그라운드 색상
  backgroundMedia: FormContentMediaModel; // 백그라운드 미디어
  isOverlay: boolean; // 백그라운드 이미지 딤드
  goodsColor: string; // 상품 정보 텍스트 색상
  isGoodsDefaultColor: BOOLEAN_VALUE_TYPE; // 상품 기본 색상 여부
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentDealAUploaderModel = {
  backgroundMedia: FormContentMediaUploadModel;
};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentDealA = (): DisplayContentDealAModel => {
  return {
    useText: true,
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
    goodsColumnType: DEAL_A_COLUMN_TYPE.TWO_COLUMN,
    fillColumn: false,
    backgroundInfo: {
      type: CONTENT_BACKGROUND_TYPE.MEDIA,
      color: '',
    },
    backgroundMedia: { ...getInitMediaContent() },
    isOverlay: false,
    goodsColor: getGoodsTextColor(true),
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContent를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormDealA = (
  contents: DisplayContentDealAModel,
): {
  contents: FormContentDealAModel;
  mediaUploader: FormContentDealAUploaderModel;
} => {
  const initValue = initDisplayContentDealA();
  const {
    useText,
    align,
    textEffect,
    title,
    subTitle,
    description,
    goodsColumnType,
    fillColumn,
    backgroundInfo,
    backgroundMedia,
    isOverlay,
    goodsColor,
  } = {
    ...initValue,
    ...contents,
  };
  const { type: backgroundType, color: backgroundColor } = backgroundInfo;
  const { mediaContents: backgroundMediaContent, mediaUploader: backgroundMediaUploader } =
    getFormMediaInfo(backgroundMedia); // 백그라운드 미디어

  const isGoodsDefaultColor = goodsColor !== '#ffffff' ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F;
  const formValue = {
    contents: {
      useText,
      align,
      textEffect: textEffect ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      title,
      subTitle,
      description,
      goodsColumnType,
      fillColumn: fillColumn ? BOOLEAN_VALUE_TYPE.T : BOOLEAN_VALUE_TYPE.F,
      backgroundType,
      backgroundColor,
      backgroundMedia: backgroundMediaContent as FormContentMediaModel,
      isOverlay,
      goodsColor: getGoodsTextColor(isGoodsDefaultColor === BOOLEAN_VALUE_TYPE.T),
      isGoodsDefaultColor,
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
export const getSubmitContentDealA = (formValue: ContentFormModel): DisplayContentDealAModel => {
  const {
    useText,
    align,
    textEffect,
    title,
    subTitle,
    description,
    goodsColumnType,
    fillColumn,
    backgroundType,
    backgroundColor,
    backgroundMedia,
    isOverlay,
    goodsColor,
  } = formValue.contents as FormContentDealAModel;

  const submitValue = {
    useText,
    align,
    textEffect: textEffect === BOOLEAN_VALUE_TYPE.T,
    title: {
      text: useText ? title.text : '',
      color: useText ? title.color : '',
      bold: useText ? title.bold : false,
    },
    subTitle: {
      text: useText ? subTitle.text : '',
      color: useText ? subTitle.color : '',
      bold: useText ? subTitle.bold : false,
    },
    description: {
      text: useText ? description.text : '',
      color: useText ? description.color : '',
      bold: useText ? description.bold : false,
    },
    goodsColumnType,
    fillColumn: fillColumn === BOOLEAN_VALUE_TYPE.T,
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
    goodsColor,
  };
  return submitValue;
};
