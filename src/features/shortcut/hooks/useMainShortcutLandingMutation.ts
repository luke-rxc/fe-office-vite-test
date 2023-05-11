import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { getMainShortcutLandingInfo } from '../apis';
import { MainShortcutLandingInfoQueryParams } from '../types';
import { MainShortcutLandingSchema } from '../schemas';
export interface UseMainShortcutLandingMutationOptions
  extends UseMutationOptions<MainShortcutLandingSchema, ErrorModel, MainShortcutLandingInfoQueryParams> {
  displaySpinner?: boolean;
}

export const useMainShortcutLandingMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseMainShortcutLandingMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MainShortcutLandingSchema, ErrorModel, MainShortcutLandingInfoQueryParams>(
    (params) => getMainShortcutLandingInfo(params),
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
