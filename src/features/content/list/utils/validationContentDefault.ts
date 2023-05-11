import * as Yup from 'yup';
import {
  CONTENT_CODE_LENGTH,
  CONTENT_CODE_REGEX,
  CONTENT_NAME_LENGTH,
  CONTENT_NAME_REGEX,
  CONTENT_STATUS_TYPE,
} from '../constants';

/**
 * 기본 관리
 */
export const validationContentDefault = Yup.object().shape({
  providerId: Yup.lazy((value) =>
    Array.isArray(value)
      ? Yup.array()
          .of(
            Yup.object().shape({
              label: Yup.string(),
              value: Yup.number().required('입점사를 선택 해 주세요'),
            }),
          )
          .min(1, '입점사를 선택 해 주세요.')
      : Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.number().required('입접사를 선택 해 주세요'),
          })
          .typeError('입점사를 선택 해 주세요.'),
  ),
  showRoomId: Yup.lazy((value) =>
    Array.isArray(value)
      ? Yup.array()
          .of(
            Yup.object().shape({
              label: Yup.string(),
              value: Yup.number().required('쇼룸을 선택 해 주세요.'),
            }),
          )
          .min(1, '쇼룸을 선택 해 주세요.')
      : Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.number().required('쇼룸을 선택 해 주세요.'),
          })
          .typeError('쇼룸을 선택 해 주세요.'),
  ),
  keywordIds: Yup.array(),
  isValidName: Yup.boolean().oneOf([true]),
  name: Yup.string()
    .matches(CONTENT_NAME_REGEX.REGEX, CONTENT_NAME_REGEX.MESSAGE)
    .max(CONTENT_NAME_LENGTH, `최대 ${CONTENT_NAME_LENGTH}자 이내 입력해 주세요.`)
    .required('콘텐츠 명을 입력해 주세요.'),
  isValidCode: Yup.boolean().oneOf([true]),
  code: Yup.string()
    .matches(CONTENT_CODE_REGEX.REGEX, CONTENT_CODE_REGEX.MESSAGE)
    .max(CONTENT_CODE_LENGTH, `최대 ${CONTENT_CODE_LENGTH}자 이내 입력해 주세요.`)
    .required('콘텐츠 코드를 입력해 주세요.'),
  publicStartDate: Yup.string()
    .nullable()
    .when('status', {
      is: (statusValue: string) => statusValue !== CONTENT_STATUS_TYPE.PRIVATE,
      then: Yup.string().typeError('공개 시작일을 입력해 주세요.').required('공개 시작일을 입력해 주세요.'),
    }),
  publicEndDate: Yup.string()
    .nullable()
    .when(['status', 'noEndDate'], {
      is: (statusValue: string, noEndDate: boolean) =>
        statusValue && statusValue !== CONTENT_STATUS_TYPE.PRIVATE && noEndDate === false,
      then: Yup.string().typeError('공개 종료일을 입력해 주세요.').required('공개 종료일을 입력해 주세요.'),
    }),
  noEndDate: Yup.boolean(),
  status: Yup.string().required(),
  primaryImage: Yup.number()
    .nullable()
    .when('status', {
      is: (statusValue: string) => statusValue !== CONTENT_STATUS_TYPE.PRIVATE,
      then: Yup.number().typeError('섬네일 이미지를 등록 해 주세요.').required('섬네일 이미지를 등록 해 주세요.'),
    }),
});
