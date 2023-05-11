import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import useLoading from '@hooks/useLoading';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { QUERY_KEY } from '../constants';
import {
  ContentDefaultFieldModel,
  ContentDefaultModel,
  ContentDefaultRequestParams,
  toContentDefaultModel,
  toContentDefaultParams,
} from '../models';
import { getContentDefault, updateContentDefault } from '../apis';

/**
 * 기본정보 관리
 */
export const useContentDefaultService = (
  contentId: number,
): {
  contentDefault: ContentDefaultModel;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isUpdateSuccess: boolean;
  isUpdateError: boolean;
  updateError: ErrorModel<ErrorDataModel>;
  handleInvalidateQuery: () => void;
  handleUpdateContentDefault: (formData: ContentDefaultFieldModel) => void;
} => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  /**
   * 기본정보 조회
   */
  const {
    data: contentDefault,
    isLoading,
    isSuccess,
    isError,
  } = useQuery([QUERY_KEY.CONTENT_DEFAULT, contentId], () => getContentDefault(contentId), {
    select: (data) => {
      return toContentDefaultModel(data);
    },
    cacheTime: 0,
  });

  /**
   * 기본정보 수정
   */
  const {
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
    mutateAsync,
  } = useMutation((value: ContentDefaultRequestParams) => updateContentDefault(contentId, value), {
    onSuccess: () => {
      hideLoading();
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      hideLoading();
    },
  });

  const handleUpdateContentDefault = (value: ContentDefaultFieldModel) => {
    showLoading();
    const params = toContentDefaultParams(value);
    mutateAsync(params);
  };

  const handleInvalidateQuery = useCallback(() => {
    client.invalidateQueries([QUERY_KEY.CONTENT_DEFAULT, contentId]);
  }, [client, contentId]);

  return {
    contentDefault,
    isLoading,
    isSuccess,
    isError,
    isUpdateSuccess,
    isUpdateError,
    updateError,
    handleInvalidateQuery,
    handleUpdateContentDefault,
  };
};
