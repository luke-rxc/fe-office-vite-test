import * as Yup from 'yup';
import { CONTENT_CODE_LENGTH, CONTENT_CODE_REGEX, CONTENT_NAME_LENGTH, CONTENT_NAME_REGEX } from '../constants';

/**
 * 컨텐츠 생성
 */
export const validationCreator = Yup.object().shape({
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
              value: Yup.number().required('쇼룸을 선택 해 주세요'),
            }),
          )
          .min(1, '쇼룸을 선택 해 주세요.')
      : Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.number().required('쇼룸을 선택 해 주세요'),
          })
          .typeError('쇼룸을 선택 해 주세요.'),
  ),
  contentsType: Yup.lazy((value) =>
    Array.isArray(value)
      ? Yup.array()
          .of(
            Yup.object().shape({
              label: Yup.string(),
              value: Yup.string().required('콘텐츠 타입을 선택 해 주세요'),
            }),
          )
          .min(1, '콘텐츠 타입을 선택 해 주세요.')
      : Yup.object()
          .shape({
            label: Yup.string(),
            value: Yup.string().required('콘텐츠 타입을 선택 해 주세요'),
          })
          .typeError('콘텐츠 타입을 선택 해 주세요.'),
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
  primaryImageId: Yup.number().nullable(),
});
