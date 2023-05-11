import * as Yup from 'yup';
import { MEDIA_A_DESC_MAX_NUM, MEDIA_A_SUBTITLE_MAX_NUM, MEDIA_A_TITLE_MAX_NUM } from '../constants';

/**
 * 미디어A 컴포넌트
 */
export const MediaAValidationSchema = Yup.object({
  contents: Yup.object().shape({
    align: Yup.string(),
    verticalAlign: Yup.string(),
    mainImage: Yup.object().shape({
      path: Yup.string(),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
    title: Yup.object().shape({
      text: Yup.string().max(MEDIA_A_TITLE_MAX_NUM, `최대 ${MEDIA_A_TITLE_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
      sizeType: Yup.string(),
    }),
    subTitle: Yup.object().shape({
      text: Yup.string().max(MEDIA_A_SUBTITLE_MAX_NUM, `최대 ${MEDIA_A_SUBTITLE_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    description: Yup.object().shape({
      text: Yup.string().max(MEDIA_A_DESC_MAX_NUM, `최대 ${MEDIA_A_DESC_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    backgroundMedia: Yup.object().shape({
      path: Yup.string().required('파일을 확인해 주세요.'),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
    isMediaRound: Yup.string(), // 'T'/'F'
    isOverlay: Yup.boolean(),
    isVideoScrollPlay: Yup.boolean(),
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
