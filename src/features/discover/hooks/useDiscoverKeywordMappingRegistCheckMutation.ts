import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postDiscoverKeywordMappingRegistCheck } from '../apis';
import { DiscoverKeywordRegistExcelItem, DiscoverKeywordRegistResponse } from '../types';
import { GoodsSchema, ShowroomSchema, ContentsSchema } from '../schemas';

export interface UseDiscoverKeywordMappingRegistCheckMutationOptions
  extends UseMutationOptions<
    Array<DiscoverKeywordRegistResponse<GoodsSchema | ShowroomSchema | ContentsSchema>>,
    ErrorModel,
    DiscoverKeywordRegistExcelItem
  > {
  displaySpinner?: boolean;
}

export const useDiscoverKeywordMappingRegistCheckMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverKeywordMappingRegistCheckMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<
    Array<DiscoverKeywordRegistResponse<GoodsSchema | ShowroomSchema | ContentsSchema>>,
    ErrorModel,
    DiscoverKeywordRegistExcelItem
  >((params) => postDiscoverKeywordMappingRegistCheck(params), {
    onMutate: (...rest) => {
      displaySpinner && showLoading();
      onMutate && onMutate(...rest);
    },
    onSettled: (...rest) => {
      displaySpinner && hideLoading();
      onSettled && onSettled(...rest);
    },
    onError: (error: ErrorModel, ...rest) => {
      onError && onError(error, ...rest);
    },
    onSuccess: (...rest) => {
      onSuccess && onSuccess(...rest);
    },
    ...options,
  });
};
