import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postDiscoverSection } from '../apis';
import { DiscoverSectionCreateFormField } from '../types';
import { toDiscoverSectionCreateParams } from '../models';

export interface UseDiscoverSectionCreateMutationOptions
  extends UseMutationOptions<object, ErrorModel, DiscoverSectionCreateFormField> {
  displaySpinner?: boolean;
}

export const useDiscoverSectionCreateMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseDiscoverSectionCreateMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<object, ErrorModel, DiscoverSectionCreateFormField>(
    (params) => postDiscoverSection(toDiscoverSectionCreateParams(params)),
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
