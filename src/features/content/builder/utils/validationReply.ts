import * as Yup from 'yup';
import { REPLY_NOTICE_TITLE_MAX_NUM, REPLY_NOTICE_SUBTITLE_MAX_NUM } from '../constants';

/**
 * 댓글 컴포넌트
 */
export const ReplyValidationSchema = Yup.object({
  contents: Yup.object().shape({
    noticeTitle: Yup.object()
      .shape({
        text: Yup.string(),
      })
      .when('useNotice', {
        is: (value: boolean) => value === true,
        then: Yup.object().shape({
          text: Yup.string()
            .required('타이틀을 입력해 주세요.')
            .max(REPLY_NOTICE_TITLE_MAX_NUM, `최대 ${REPLY_NOTICE_TITLE_MAX_NUM}자 이내 입력해 주세요.`),
        }),
      }),
    noticeSubTitle: Yup.object()
      .shape({
        text: Yup.string(),
      })
      .when('useNotice', {
        is: (value: boolean) => value === true,
        then: Yup.object().shape({
          text: Yup.string()
            .required('서브 타이틀을 입력해 주세요.')
            .max(REPLY_NOTICE_SUBTITLE_MAX_NUM, `최대 ${REPLY_NOTICE_SUBTITLE_MAX_NUM}자 이내 입력해 주세요.`),
        }),
      }),
    useNotice: Yup.boolean(),
  }),
});
