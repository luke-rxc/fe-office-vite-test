import * as Yup from 'yup';
import { IMAGE_VIEWER_ACTION_TYPE } from '../constants';

/**
 * 이미지 뷰어 컴포넌트
 */
export const ImageViewerValidationSchema = Yup.object({
  contents: Yup.object().shape({
    image: Yup.object().shape({
      path: Yup.string().required('이미지를 확인해 주세요.'),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
    actions: Yup.object().when('useActions', {
      is: (value: boolean) => value === true,
      then: Yup.object().shape({
        actionType: Yup.string(),
        value: Yup.string()
          .when('actionType', {
            is: (value: string) => value === IMAGE_VIEWER_ACTION_TYPE.GOODS,
            then: Yup.string().matches(/^[0-9]{5,}$/, '상품 ID를 다시 입력해주세요'),
          })
          .when('actionType', {
            is: (value: string) => value === IMAGE_VIEWER_ACTION_TYPE.SHOWROOM,
            then: Yup.string().matches(/^[a-z0-9]{1,15}$/, '쇼룸 코드를 다시 입력해주세요'),
          })
          .when('actionType', {
            is: (value: string) => value === IMAGE_VIEWER_ACTION_TYPE.CONTENT_STORY,
            then: Yup.string().matches(/^[a-z0-9]{1,15}$/, '콘텐츠 코드를 다시 입력해주세요'),
          })
          .when('actionType', {
            is: (value: string) => value === IMAGE_VIEWER_ACTION_TYPE.CONTENT_TEASER,
            then: Yup.string().matches(/^[a-z0-9]{1,15}$/, '콘텐츠 코드를 다시 입력해주세요'),
          }),
      }),
    }),
    useActions: Yup.boolean(),
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
