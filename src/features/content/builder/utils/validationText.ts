import * as Yup from 'yup';
import {
  CONTENT_BACKGROUND_TYPE,
  TEXT_TITLE1_MAX_NUM,
  TEXT_TITLE2_MAX_NUM,
  TEXT_SUBTITLE1_MAX_NUM,
  TEXT_SUBTITLE2_MAX_NUM,
  TEXT_SUBTITLE3_MAX_NUM,
  TEXT_DESC_MAX_NUM,
} from '../constants';

/**
 * 텍스트 컴포넌트
 */
export const TextValidationSchema = Yup.object({
  contents: Yup.object().shape({
    align: Yup.string(),
    title1: Yup.object().shape({
      text: Yup.string().max(TEXT_TITLE1_MAX_NUM, `최대 ${TEXT_TITLE1_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
      sizeType: Yup.string(),
    }),
    title2: Yup.object().shape({
      text: Yup.string().max(TEXT_TITLE2_MAX_NUM, `최대 ${TEXT_TITLE2_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
      sizeType: Yup.string(),
    }),
    subTitle1: Yup.object().shape({
      text: Yup.string().max(TEXT_SUBTITLE1_MAX_NUM, `최대 ${TEXT_SUBTITLE1_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    subTitle2: Yup.object().shape({
      text: Yup.string().max(TEXT_SUBTITLE2_MAX_NUM, `최대 ${TEXT_SUBTITLE2_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    subTitle3: Yup.object().shape({
      text: Yup.string().max(TEXT_SUBTITLE3_MAX_NUM, `최대 ${TEXT_SUBTITLE3_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    description: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().max(TEXT_DESC_MAX_NUM, `최대 ${TEXT_DESC_MAX_NUM}자 이내 입력해 주세요.`),
        bold: Yup.boolean(),
        color: Yup.string(),
      }),
    ),
    useMedia: Yup.boolean(),
    mediaViewRatioType: Yup.string()
      .nullable()
      .when('useMedia', {
        is: (value: boolean) => value === true,
        then: Yup.string().required('이미지 / 비디오 노출 타입을 선택 해 주세요'),
      }),
    isMediaRound: Yup.string(), // 'T'/'F'
    media: Yup.object()
      .shape({
        path: Yup.string(),
        id: Yup.number().nullable(),
        type: Yup.string().nullable(),
        width: Yup.number(),
        height: Yup.number(),
        fileSize: Yup.number(),
        extension: Yup.string(),
        posterImage: Yup.string(),
      })
      .when('useMedia', {
        is: (value: boolean) => value === true,
        then: Yup.object().shape({
          path: Yup.string().required('이미지/비디오를 확인해 주세요.'),
        }),
      }),
    useBackground: Yup.boolean(),
    backgroundType: Yup.string(),
    backgroundColor: Yup.string(),
    backgroundMedia: Yup.object()
      .shape({
        path: Yup.string(),
        id: Yup.number().nullable(),
        type: Yup.string().nullable(),
        width: Yup.number(),
        height: Yup.number(),
        fileSize: Yup.number(),
        extension: Yup.string(),
        posterImage: Yup.string(),
      })
      .when(['useBackground', 'backgroundType'], {
        is: (useBackgroundValue: boolean, backgroundTypeValue: string) =>
          useBackgroundValue === true && backgroundTypeValue === CONTENT_BACKGROUND_TYPE.MEDIA,
        then: Yup.object().shape({
          path: Yup.string().required('이미지/비디오를 확인해 주세요.'),
        }),
      }),
    parallaxMode: Yup.boolean(),
    isOverlay: Yup.boolean(),
    useDisplayDateTime: Yup.boolean(),
    displayStartDateTime: Yup.string().when('useDisplayDateTime', {
      is: (value: boolean) => value === true,
      then: Yup.string().when('displayEndDateTime', (displayEndDateTime, schema) => {
        return schema.test({
          test: (displayStartDateTime) => {
            if (!displayStartDateTime) {
              return false;
            }

            return true;
          },
          message: '노출 시작시간을 확인 해 주세요.',
        });
      }),
    }),
    displayEndDateTime: Yup.string().when('useDisplayDateTime', {
      is: (value: boolean) => value === true,
      then: Yup.string().when('displayStartDateTime', (displayStartDateTime, schema) => {
        return schema.test({
          test: (displayEndDateTime) => {
            if (!displayEndDateTime) {
              return false;
            }

            if (displayStartDateTime && displayEndDateTime) {
              return new Date(displayEndDateTime) >= new Date(displayStartDateTime);
            }
            return true;
          },
          message: '노출 종료시간을 확인 해 주세요.',
        });
      }),
    }),
  }),
});
