import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postRaffleEvent } from '../apis';
import { RaffleEventCreateParams } from '../types';

export interface UseRaffleEventCreateMutationOptions
  extends UseMutationOptions<void, ErrorModel, RaffleEventCreateParams> {
  displaySpinner?: boolean;
}

/**
 * 래플 이벤트 등록 mutation
 */
export const useRaffleEventCreateMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseRaffleEventCreateMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<void, ErrorModel, RaffleEventCreateParams>((params) => postRaffleEvent(params), {
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
