import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postRaffleEventCopyTimesItem } from '../apis';
import { RaffleEventTimesSchema } from '../schemas';
import { RaffleEventCopyParams } from '../types';

export interface UseRaffleEventCopyTimesItemMutationOptions
  extends UseMutationOptions<RaffleEventTimesSchema, ErrorModel, RaffleEventCopyParams> {
  displaySpinner?: boolean;
}

/**
 * 래플 이벤트 회차 복사 mutation
 */
export const useRaffleEventCopyTimesItemMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseRaffleEventCopyTimesItemMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<RaffleEventTimesSchema, ErrorModel, RaffleEventCopyParams>(
    (params) => postRaffleEventCopyTimesItem(params),
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
