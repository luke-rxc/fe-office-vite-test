import { ContentFormModel, FormContentTextItemModel, TextItemModel } from './Content';

/**
 * display Data -> 프론트로 bypass 되는 형태
 */
export type DisplayContentReplyModel = {
  useNotice: boolean; // 알림 텍스트 사용여부
  noticeTitle: Pick<TextItemModel, 'text'>; // 알림타이틀
  noticeSubTitle: Pick<TextItemModel, 'text'>; // 알림서브타이틀
};

/**
 * 폼 - 컨텐츠 Data
 */
export type FormContentReplyModel = {
  useNotice: boolean; // 알림 텍스트 사용여부
  noticeTitle: Pick<FormContentTextItemModel, 'text'>; // 알림타이틀
  noticeSubTitle: Pick<FormContentTextItemModel, 'text'>; // 알림서브타이틀
};

/**
 * 폼 - 미디어 업로드 Data
 */
export type FormContentReplyUploaderModel = {};

/**
 * 초기 디스플레이 데이터 설정
 * @returns
 */
export const initDisplayContentReply = (): DisplayContentReplyModel => {
  return {
    useNotice: true,
    noticeTitle: {
      text: '',
    },
    noticeSubTitle: {
      text: '',
    },
  };
};

/**
 * 초기 폼 요소 데이터 설정
 * DisplayContents를 기반으로 필요한 폼 데이터를 지정한다.
 * @param contents
 * @returns
 */
export const initFormReply = (
  contents: DisplayContentReplyModel,
): {
  contents: FormContentReplyModel;
  mediaUploader: FormContentReplyUploaderModel;
} => {
  const initValue = initDisplayContentReply();
  const { useNotice, noticeTitle, noticeSubTitle } = { ...initValue, ...contents };

  const formValue = {
    contents: {
      useNotice,
      noticeTitle,
      noticeSubTitle,
    },
    mediaUploader: {},
  };
  return formValue;
};

/**
 * submit 시 Display Data를 bypass 하기 위해 폼 정보를 대상으로 display contents 정의
 * @param formValue
 * @returns
 */
export const getSubmitContentReply = (formValue: ContentFormModel): DisplayContentReplyModel => {
  const { useNotice, noticeTitle, noticeSubTitle } = formValue.contents as FormContentReplyModel;

  const submitValue = {
    useNotice,
    noticeTitle: useNotice
      ? noticeTitle
      : {
          text: '',
        },
    noticeSubTitle: useNotice
      ? noticeSubTitle
      : {
          text: '',
        },
  };
  return submitValue;
};
