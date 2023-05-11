import * as Yup from 'yup';
import isEmpty from 'lodash/isEmpty';
import { yupResolver } from '@hookform/resolvers/yup';
import { ShowroomFormFields, SectionFormFields } from '../types';
import { getIsValidShowroomName, getIsValidShowroomCode } from '../apis';

/**
 * 백앤드에서 동일하게 사용하는 정규표현식
 */
const rxg = {
  /** 쇼룸코드 */
  code: new RegExp(/^[0-9a-z]{1,15}$/),
  /** 쇼룸명  */
  name: new RegExp(/^[0-9a-zA-Z가-힣]{1,15}$/),
  /** HEX Color */
  color: new RegExp(/^#?([a-fA-Z0-9]{6}|[a-fA-Z0-9]{3})$/),
};

/**
 * 문자열의 유효성 체크
 */
const isValid = (type: keyof typeof rxg, value: string): boolean => {
  return rxg[type].test(value);
};

/**
 * 에러 텍스트
 */
const invalidText = {
  type: {
    required: '쇼룸종류 설정은 필수 입력항목입니다.',
  },
  brand: {
    required: '브랜드 설정은 필수 입력항목입니다.',
  },
  provider: {
    required: '입점사 설정은 필수 입력항목입니다.',
  },
  status: {
    required: '공개여부 설정은 필수 입력항목입니다.',
  },
  name: {
    required: '쇼룸명 설정은 필수 입력항목입니다.',
    invalid: '최대 15자 영문, 한글, 숫자만 입력 가능합니다.',
    overlap: '이미 동일한 쇼룸명이 존재합니다.',
  },
  code: {
    required: '쇼룸코드 설정은 필수 입력항목입니다.',
    invalid: '최대 15자 영문 소문자, 숫자만 입력 가능합니다.',
    overlap: '이미 동일한 쇼룸코드가 존재합니다.',
  },
  primaryImage: {
    required: '공개 상태에서 대표이미지는 필수 등록 입니다.',
  },
  coverMedia: {
    required: '공개 상태에서 커버이미지(비디오)는 필수 등록 입니다.',
  },
};

/**
 * 쇼룸 생성 필드 유효성 검사
 */
export const showroomCreateValidation = () =>
  yupResolver(
    Yup.object().shape<Partial<Record<keyof ShowroomFormFields, any>>>({
      type: Yup.object().nullable().required(invalidText.type.required),
      brand: Yup.object().nullable().required(invalidText.brand.required),
      provider: Yup.object().nullable().required(invalidText.provider.required),
      name: Yup.string()
        .nullable()
        .required(invalidText.name.required)
        .test('invalid', invalidText.name.invalid, (name) => isValid('name', name))
        .test('overlap', invalidText.name.overlap, (name) => getIsValidShowroomName({ name })),
      code: Yup.string()
        .nullable()
        .required(invalidText.code.required)
        .test('invalid', invalidText.code.invalid, (code) => isValid('code', code))
        .test('overlap', invalidText.code.overlap, (code) => getIsValidShowroomCode({ code })),
    }),
  );

/**
 * 쇼룸 수정 필드 유효성 검사
 */
export const showroomUpdateValidation = (showroomId: number) =>
  yupResolver(
    Yup.object().shape<Partial<Record<keyof ShowroomFormFields, any>>>({
      type: Yup.object().nullable().required(invalidText.type.required),
      brand: Yup.object().nullable().required(invalidText.brand.required),
      status: Yup.object().nullable().required(invalidText.status.required),
      name: Yup.string()
        .nullable()
        .required(invalidText.name.required)
        .test('name invalid', invalidText.name.invalid, (name) => isValid('name', name))
        .test('name overlap', invalidText.name.overlap, (name) => getIsValidShowroomName({ showroomId, name })),
      code: Yup.string()
        .nullable()
        .required(invalidText.code.required)
        .test('code invalid', invalidText.code.invalid, (code) => isValid('code', code))
        .test('code overlap', invalidText.code.overlap, (code) => getIsValidShowroomCode({ showroomId, code })),
      primaryImage: Yup.array().test('required', invalidText.primaryImage.required, (primaryImage, { from }: any) => {
        const { value } = from[0] as { value: ShowroomFormFields };
        //공개 상태에서 대표이미지는 필수값
        return !(value?.status?.id === 'PUBLIC' && isEmpty(primaryImage));
      }),
      coverMedia: Yup.array().test('required', invalidText.coverMedia.required, (coverMedia, { from }: any) => {
        const { value } = from[0] as { value: ShowroomFormFields };
        //공개 상태에서 커버이미지는 필수값
        return !(value?.status?.id === 'PUBLIC' && isEmpty(coverMedia));
      }),
    }),
  );

export const sectionValidation = () =>
  yupResolver(
    Yup.object().shape<Partial<Record<keyof SectionFormFields, any>>>({
      name: Yup.string()
        .transform((value) => value.trim())
        .required('필수로 입력해주세요'),
      order: Yup.number()
        .transform((value) => (value !== 0 && value ? value : undefined))
        .typeError('숫자만 입력해주세요')
        .required('필수로 입력해주세요'),
    }),
  );
