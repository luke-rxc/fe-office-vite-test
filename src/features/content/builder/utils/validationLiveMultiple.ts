import * as Yup from 'yup';
import { CONTENT_BACKGROUND_TYPE } from '../constants';
/**
 * 라이브 멀티 컴포넌트
 */
export const LiveMultipleValidationSchema = Yup.object({
  contents: Yup.object().shape({
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
          path: Yup.string().required('이미지를 확인해 주세요.'),
        }),
      }),
  }),
  liveList: Yup.array().required().min(1, '라이브 콘텐츠를 등록해 주세요.'),
});
