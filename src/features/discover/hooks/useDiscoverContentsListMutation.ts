import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { getContentsList } from '../apis';
import { ContentsSearchParams } from '../types';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ContentsSchema } from '../schemas';

export interface useDiscoverContentsListMutationOptions
  extends UseMutationOptions<PaginationResponse<ContentsSchema>, ErrorModel, ContentsSearchParams> {
  displaySpinner?: boolean;
}

export const useDiscoverContentsListMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: useDiscoverContentsListMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<PaginationResponse<ContentsSchema>, ErrorModel, ContentsSearchParams>(
    (params) => getContentsList(params),
    {
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
    },
  );
};
