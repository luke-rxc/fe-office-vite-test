import { baseApiClient } from '@utils/api';
import { ShowroomSearchSchema, ShowroomSearchContentSchema, ShowroomInfoSchema } from '../schemas';

/**************************************************************************
 * 쇼룸
 **************************************************************************/

/**
 * 쇼룸 목록 조회
 */
export const getShowroomList = async ({ page, size, ...params }: GetShowroomListParams) => {
  return await baseApiClient.post<ShowroomSearchSchema>(`/showroom/search?page=${page}&size=${size}`, params);
};

export interface GetShowroomListParams {
  size?: number;
  page?: number;
  startDate?: number;
  endDate?: number;
  searchType?: 'ALL' | 'ID' | 'CODE' | 'NAME' | 'PROVIDER_NAME' | 'BRAND_NAME';
  periodDateType?: 'ALL' | 'CREATE' | 'UPDATE';
  status?: 'ALL' | 'ADMIN_PUBLIC' | 'PRIVATE' | 'PUBLIC';
  keyword?: string;
  keywordIds?: number[];
  type?: 'ALL' | 'NORMAL' | 'PGM' | 'CONCEPT';
  exceptShowRoomIds?: number[];
}

/**
 * 쇼룸 상세 조회
 */
export const getShowroomInfo = async ({ showroomId }: GetShowroomInfoParams) => {
  return await baseApiClient.get<ShowroomInfoSchema>(`/showroom/${showroomId}`);
};

export interface GetShowroomInfoParams {
  showroomId: number;
}

/**
 * 쇼룸 생성
 */
export const createShowroom = async (params: CreateShowroomParams) => {
  return await baseApiClient.post<ShowroomInfoSchema>(`/showroom`, params);
};

export interface CreateShowroomParams {
  providerId: number;
  brandId: number;
  code: string;
  name: string;
  showRoomType: 'NORMAL' | 'PGM' | 'CONCEPT';
  categoryId?: number;
  keywordIds?: number[];
  description?: string;
  primaryImageId?: number;
  lottieImageId?: number;
  coverImageId?: number;
  coverVideoId?: number;
}

/**
 * 쇼룸 수정
 */
export const updateShowroomInfo = async ({ showroomId, ...params }: UpdateShowroomInfoParams) => {
  return await baseApiClient.put<ShowroomInfoSchema>(`/showroom/${showroomId}`, params);
};

export interface UpdateShowroomInfoParams {
  showroomId: number;
  showroomType: 'PGM' | 'NORMAL' | 'CONCEPT';
  providerId: number;
  brandId: number;
  code: string;
  name: string;
  categoryId?: number;
  keywordIds?: number[];
  description?: string;
  primaryImageId: number;
  lottieImageId?: number;
  coverImageId?: number;
  coverVideoId?: number;
  status: 'ADMIN_PUBLIC' | 'PRIVATE' | 'PUBLIC';
  textColor: string;
  tintColor: string;
  contentColor: string;
  backgroundColor: string;
  discoverUse: boolean;
}

/**
 * 중복 체크 :: 쇼룸코드
 */
export const getIsValidShowroomCode = async ({ showroomId, code }: IGetIsValidShowroomIdParams) => {
  const apiUrl = showroomId
    ? `/showroom/${showroomId}/validate/code?value=${code}`
    : `/showroom/validate/code?value=${code}`;

  return await baseApiClient.get<any>(apiUrl);
};

export interface IGetIsValidShowroomIdParams {
  showroomId?: number;
  code: string;
}

/**
 * 중복 체크 :: 쇼룸이름
 */
export const getIsValidShowroomName = async ({ showroomId, name }: IGetIsValidShowroomNameParams) => {
  const apiUrl = showroomId
    ? `/showroom/${showroomId}/validate/name?value=${name}`
    : `/showroom/validate/name?value=${name}`;

  return await baseApiClient.get<any>(apiUrl);
};

export interface IGetIsValidShowroomNameParams {
  showroomId?: number;
  name: string;
}

/**************************************************************************
 * 소속쇼룸
 **************************************************************************/

/**
 * 소속쇼룸 목록 조회
 */
export const getSubShowroomList = async ({ showroomId }: GetSubShowroomListParams) => {
  return await baseApiClient.get<ShowroomSearchContentSchema[]>(`/showroom/${showroomId}/pgm`);
};

export interface GetSubShowroomListParams {
  showroomId: number;
}

/**
 * 등록가능 소속쇼룸 목록 조회
 */
export const getAddableSubShowroomList = async (params: GetAddableSubShowroomListParams) => {
  const { showroomId, page, size, ...rest } = params;

  return await baseApiClient.post<ShowroomSearchSchema>(
    `/showroom/${showroomId}/pgm/search?page=${page}&size=${size}`,
    rest,
  );
};

export interface GetAddableSubShowroomListParams extends GetShowroomListParams {
  showroomId: number;
}

/**
 * 소속쇼룸 목록 수정
 */
export const updateSubShowroomList = async ({ showroomId, ids }: UpdateSubShowroomListParams) => {
  return await baseApiClient.put<ShowroomSearchContentSchema[]>(`/showroom/${showroomId}/pgm`, { ids });
};

export interface UpdateSubShowroomListParams {
  showroomId: number;
  ids: number[];
}
