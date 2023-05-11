import * as Yup from 'yup';
import {
  CONTENT_BACKGROUND_TYPE,
  CTA_DESC_MAX_NUM,
  CTA_LABEL_MAX_NUM,
  CTA_SUBTITLE_MAX_NUM,
  CTA_TITLE_MAX_NUM,
  CTA_BUTTON_ACTION_TYPE,
} from '../constants';

/**
 * CTA 컴포넌트
 */
export const CTAValidationSchema = Yup.object({
  contents: Yup.object().shape({
    direction: Yup.string(),
    buttonType: Yup.string(),
    title: Yup.object().shape({
      text: Yup.string().max(CTA_TITLE_MAX_NUM, `최대 ${CTA_TITLE_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    subTitle: Yup.object().shape({
      text: Yup.string().max(CTA_SUBTITLE_MAX_NUM, `최대 ${CTA_SUBTITLE_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    description: Yup.object().shape({
      text: Yup.string().max(CTA_DESC_MAX_NUM, `최대 ${CTA_DESC_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
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
      .when('backgroundType', {
        is: (value: string) => value === CONTENT_BACKGROUND_TYPE.MEDIA,
        then: Yup.object().shape({
          path: Yup.string(),
        }),
      }),
    isOverlay: Yup.boolean(),
    align: Yup.string(),
    buttons: Yup.array().of(
      Yup.object().shape({
        buttonActionType: Yup.string(),
        value: Yup.string()
          .when('buttonActionType', {
            is: (value: string) => value === CTA_BUTTON_ACTION_TYPE.EXTERNAL_WEB,
            then: Yup.string()
              .matches(/^(http(s)?:\/\/)/, 'http:// 혹은 https://를 포함한 전체 url을 입력해 주세요.')
              .test('value', '외부링크를 입력해 주세요.', (buttonValue) => {
                const includeServiceUrl = buttonValue.match('prizm.co.kr');
                return includeServiceUrl && includeServiceUrl.length > 0 ? false : true;
              }),
          })
          .when('buttonActionType', {
            is: (value: string) => value === CTA_BUTTON_ACTION_TYPE.COUPON,
            then: Yup.string().matches(/^[0-9]{1,}$/, '쿠폰번호를 입력해 주세요.'),
          })
          .when('buttonActionType', {
            is: (value: string) => value === CTA_BUTTON_ACTION_TYPE.DEEP_LINK,
            then: Yup.string()
              .test('value', 'prizm://prizm.co.kr를 제외한 path만 입력해 주세요', (buttonValue) => {
                const includeServiceUrl = buttonValue.match('prizm://prizm.co.kr');
                return includeServiceUrl && includeServiceUrl.length > 0 ? false : true;
              })
              .matches(/^(\/)/, '/를 포함한 path를 입력해 주세요. ex)/orders/123456'),
          }),
        bg: Yup.string(),
        label: Yup.object().shape({
          text: Yup.string()
            .min(1, '레이블을 입력해 주세요')
            .max(CTA_LABEL_MAX_NUM, `최대 ${CTA_LABEL_MAX_NUM}자 이내 입력해 주세요.`),
          color: Yup.string(),
        }),
      }),
    ),
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
