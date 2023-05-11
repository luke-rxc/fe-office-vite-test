import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { putSaveRaffleEvent } from '../apis';
import { RaffleEventSaveParams } from '../types';

export interface UseRaffleEventSaveMutationOptions extends UseMutationOptions<void, ErrorModel, RaffleEventSaveParams> {
  displaySpinner?: boolean;
}

/**
 * 래플 이벤트 저장 mutation
 */
export const useRaffleEventSaveMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseRaffleEventSaveMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<void, ErrorModel, RaffleEventSaveParams>((params) => putSaveRaffleEvent(params), {
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
