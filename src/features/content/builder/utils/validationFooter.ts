import * as Yup from 'yup';
import { CONTENT_BACKGROUND_TYPE } from '../constants';

/**
 * 푸터 컴포넌트
 */
export const FooterValidationSchema = Yup.object({
  contents: Yup.object().shape({
    color: Yup.string(),
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
          path: Yup.string().required('이미지를 확인해 주세요.'),
        }),
      }),
    isOverlay: Yup.boolean(),
  }),
});
