import * as Yup from 'yup';
import { LIVE_SUBTITLE_MAX_NUM, LIVE_TITLE_MAX_NUM } from '../constants';
/**
 * 라이브 컴포넌트
 */
export const LiveValidationSchema = Yup.object({
  contents: Yup.object().shape({
    align: Yup.string(),
    backgroundMedia: Yup.object().shape({
      path: Yup.string().required('이미지를 확인해 주세요.'),
      id: Yup.number().nullable(),
      type: Yup.string().nullable(),
      width: Yup.number(),
      height: Yup.number(),
      fileSize: Yup.number(),
      extension: Yup.string(),
      posterImage: Yup.string(),
    }),
    isOverlay: Yup.boolean(),
    title: Yup.object().shape({
      text: Yup.string()
        .max(LIVE_TITLE_MAX_NUM, `최대 ${LIVE_TITLE_MAX_NUM}자 이내 입력해 주세요.`)
        .required('타이틀을 입력해 주세요.'),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
    subTitle: Yup.object().shape({
      text: Yup.string().max(LIVE_SUBTITLE_MAX_NUM, `최대 ${LIVE_SUBTITLE_MAX_NUM}자 이내 입력해 주세요.`),
      bold: Yup.boolean(),
      color: Yup.string(),
    }),
  }),
  liveList: Yup.array().required().min(1, '라이브 콘텐츠를 등록해 주세요.'),
});
