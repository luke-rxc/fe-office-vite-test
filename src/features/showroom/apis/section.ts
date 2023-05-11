import { baseApiClient } from '@utils/api';
import { SectionListSchema, SectionListItemSchema } from '../schemas';

/**
 * 섹션 리스트 조회
 */
export const getSectionList = async ({ showroomId, size = 10, page = 1 }: GetSectionListParams) => {
  return await baseApiClient.get<SectionListSchema>(`/showroom/${showroomId}/section?page=${page}&size=${size}`);
};

export interface GetSectionListParams {
  showroomId: number;
  size?: number;
  page?: number;
}

/**
 * 섹션 삭제
 */
export const deleteSection = async ({ showroomId, ...params }: DeleteSectionParams) => {
  return await baseApiClient.delete(`/showroom/${showroomId}/section`, params);
};

export interface DeleteSectionParams {
  showroomId: number;
  contentIds: number[];
}

/**
 * 섹션 공개상태 값 수정
 */
export const updateSectionStatus = async ({ showroomId, sectionId, ...params }: UpdateSectionStatusParams) => {
  return await baseApiClient.put<SectionListItemSchema>(`/showroom/${showroomId}/section/${sectionId}/status`, params);
};

export interface UpdateSectionStatusParams {
  showroomId: number;
  sectionId: number;
  status: 'PRIVATE' | 'PUBLIC';
}

/**
 *
 */
export const getSectionInfo = async ({ showroomId, sectionId }: GetSectionInfoParams) => {
  return await baseApiClient.get<SectionListItemSchema>(`/showroom/${showroomId}/section/${sectionId}`);
};

export interface GetSectionInfoParams {
  showroomId: number;
  sectionId: number;
}

/**
 *
 */
export const updateSectionInfo = async ({ showroomId, sectionId, ...params }: UpdateSectionListParams) => {
  return await baseApiClient.put<SectionListItemSchema>(`/showroom/${showroomId}/section/${sectionId}`, params);
};

export interface UpdateSectionListParams {
  showroomId: number;
  sectionId: number;
  contentIds: number[];
  sortNumber: number;
  status: 'PRIVATE' | 'PUBLIC';
  title: string;
}

export const createSection = async ({ showroomId, ...params }: CreateSectionParams) => {
  return await baseApiClient.post<SectionListItemSchema>(`/showroom/${showroomId}/section/`, params);
};

export interface CreateSectionParams {
  showroomId: number;
  contentIds: number[];
  sortNumber: number;
  status: 'PRIVATE' | 'PUBLIC';
  title: string;
}
