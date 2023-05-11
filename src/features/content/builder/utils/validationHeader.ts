import * as Yup from 'yup';
import { CONTENT_BACKGROUND_TYPE } from '../constants';

/**
 * 헤더 컴포넌트
 */
export const HeaderValidationSchema = Yup.object({
  contents: Yup.object().shape({
    verticalAlign: Yup.string().required(),
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
    logoImage: Yup.object().shape({
      path: Yup.string().required('이미지를 확인해 주세요.'),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
    mainImage: Yup.object().shape({
      path: Yup.string().required('이미지를 확인해 주세요.'),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
    footerImage: Yup.object().shape({
      path: Yup.string().required('이미지를 확인해 주세요.'),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
  }),
});
