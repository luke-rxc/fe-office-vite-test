import pick from 'lodash/pick';
import find from 'lodash/find';
import compact from 'lodash/compact';
import toNumber from 'lodash/toNumber';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import { toDateFormat } from '@utils/date';
import { UploadFileInfo } from '@models/UploadModel';
import { parse } from '../utils';
import { GetShowroomListParams, CreateShowroomParams, UpdateShowroomInfoParams } from '../apis';
import { ShowroomSearchContentSchema, ShowroomInfoSchema } from '../schemas';
import { ShowroomSearchFields, ShowroomListItem, ShowroomFormFields } from '../types';
import { ShowroomSearchFieldDefaultValues, ShowroomStatusOptions, ShowroomTypeOptions } from '../constants';

type ShowroomSearchQueryModel = Partial<Omit<ShowroomSearchFields, 'keywords'> & { keywords: string | string[] }>;

type UpdateShowroomFormFieldsModel = Omit<ShowroomFormFields, 'primaryImage' | 'coverMedia' | 'lottieImage'> &
  Record<keyof Pick<ShowroomFormFields, 'primaryImage' | 'coverMedia' | 'lottieImage'>, UploadFileInfo>;

/**
 * nested한 Keywords를 stringify가능한 형태로 인코딩
 */
const toEncodeKeywords = (keywords: ShowroomSearchFields['keywords']): { keywords: string[] } => {
  return { keywords: keywords.map((keyword) => encodeURIComponent(JSON.stringify(keyword))) };
};

/**
 * stringify된 nested한 Keywords를 디코딩
 */
const toDecodeKeywords = (keywords: ShowroomSearchQueryModel['keywords']): Pick<ShowroomSearchFields, 'keywords'> => {
  try {
    if (isArray(keywords)) {
      return { keywords: keywords.map((keyword) => JSON.parse(decodeURIComponent(keyword))) };
    }

    if (isString(keywords)) {
      return { keywords: [JSON.parse(decodeURIComponent(keywords))] };
    }

    throw new Error('잘못된 키워드 값');
  } catch (error) {
    return { keywords: [] };
  }
};

/**`
 * 쇼룸 커버 이미지/비디오 소스 id를 추출
 */
const toCoverIdsModel = (coverMedia?: UploadFileInfo) => {
  if (!coverMedia) {
    return {};
  }

  // 비디오 타입
  if (coverMedia.fileType === 'VIDEO') {
    return {
      coverVideoId: coverMedia.id,
      /**
       * thumbnail => s3에 video 업로드 후 받은 response인 경우
       * thumbnailImage => 이미 업로드되어 있던 video인 경우
       */
      coverImageId: coverMedia.thumbnail?.id || coverMedia.thumbnailImage?.id,
    };
  }

  // 이미지 타입
  return {
    coverImageId: coverMedia.id,
  };
};

/**
 * 쇼룸검색 필드 => 검색API 파라미터
 */
export const toShowroomSearchParamsModel = (values: ShowroomSearchFields): GetShowroomListParams => {
  const { dateType: periodDateType, keywords, ...rest } = values;

  return {
    keywordIds: (keywords || []).map(({ id }) => toNumber(id)),
    periodDateType,
    ...rest,
  };
};

/**
 * 쇼룸검색 필드 => stringify가능한 형태로 변환
 */
export const toShowroomSearchQueryModel = (values: ShowroomSearchFields): ShowroomSearchQueryModel => {
  const { keywords, ...rest } = values;
  return {
    ...rest,
    // 키워드가 배열안의 오브젝트 타입으로 nested한 구조를 가지고있어 한번의 변환이 필요
    ...toEncodeKeywords(keywords || []),
  };
};

/**
 * URL QueryString => 쇼룸검색 필드
 */
export const toShowroomSearchFieldsModel = (query?: string): ShowroomSearchFields => {
  const { keywords, ...qs } = parse<ShowroomSearchQueryModel>(query || '');

  return {
    ...ShowroomSearchFieldDefaultValues,
    ...pick(qs, Object.keys(ShowroomSearchFieldDefaultValues)),
    ...toDecodeKeywords(keywords),
  };
};

/**
 * 쇼룸검색 API 응답값 => 검색결과 테이블 데이터
 */
export const toShowroomListModel = (schema: ShowroomSearchContentSchema[]): ShowroomListItem[] =>
  (schema || []).map((content): ShowroomListItem => {
    const { brandId, providerId, keywordList, createdDate, lastUpdatedDate, ...rest } = content;

    return {
      keywords: keywordList.map(({ name }) => name),
      updatedDate: lastUpdatedDate && toDateFormat(lastUpdatedDate),
      createdDate: createdDate && toDateFormat(createdDate),
      ...rest,
    };
  });

/**
 * 쇼룸정보입력 필드 => 쇼룸생성 API 파라미터
 */
export const toShowroomCreateParamsModel = (values: ShowroomFormFields): CreateShowroomParams => ({
  code: values.code,
  name: values.name,
  showRoomType: values.type.id,
  providerId: values.provider.id,
  brandId: values.brand.id,
});

/**
 * 쇼룸정보입력 필드 => 쇼룸수정 API 파라미터
 */
export const toShowroomInfoUpdateParamsModel = (
  showroomId: number,
  values: UpdateShowroomFormFieldsModel,
): UpdateShowroomInfoParams => {
  const { type, tintColor, backgroundColor } = values;

  return {
    showroomId,
    code: values.code,
    name: values.name,
    description: values.description,
    showroomType: values.type.id,
    status: values.status.id,
    tintColor: values.tintColor,
    textColor: values.textColor,
    contentColor: values.contentColor,
    backgroundColor: type.id !== 'CONCEPT' ? tintColor : backgroundColor,
    providerId: values.provider.id,
    brandId: values.brand.id,
    keywordIds: values.keywords.map(({ id }) => id),
    primaryImageId: values.primaryImage?.id,
    lottieImageId: values.lottieImage?.id,
    discoverUse: values.discoverUse,
    ...toCoverIdsModel(values.coverMedia),
  };
};

/**
 * 쇼룸정보 API 응답값 => 쇼룸정보입력 필드
 */
export const toShowroomInfoModel = (schema: ShowroomInfoSchema): ShowroomFormFields => {
  const { coverVideo, coverImage } = schema;
  const coverMedia = coverVideo ? { ...coverVideo, thumbnailImage: coverImage } : coverImage;

  return {
    description: schema.description || '',
    code: schema.code,
    name: schema.name,
    type: find(ShowroomTypeOptions, (o) => o.id === schema.showRoomType),
    status: find(ShowroomStatusOptions, (o) => o.id === schema.status),
    brand: { id: schema.brandId, name: schema.brandName },
    provider: { id: schema.providerId, name: schema.providerName },
    keywords: schema.keywords,
    primaryImage: compact([schema.primaryImage]),
    coverMedia: compact([coverMedia]),
    lottieImage: compact([schema.lottieImage]),
    tintColor: schema.tintColor || '',
    textColor: schema.textColor || '',
    contentColor: schema.contentColor || '',
    backgroundColor: schema.backgroundColor || '',
    discoverUse: schema.discoverUse || false,
  };
};
