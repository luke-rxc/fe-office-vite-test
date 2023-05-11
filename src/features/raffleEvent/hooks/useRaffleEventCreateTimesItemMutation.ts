import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postRaffleEventCreateTimesItem } from '../apis';
import { RaffleEventTimesSchema } from '../schemas';

export interface UseRaffleEventCreateTimesItemMutationOptions
  extends UseMutationOptions<RaffleEventTimesSchema, ErrorModel, number> {
  displaySpinner?: boolean;
}

/**
 * 래플 이벤트 회차 추가 mutation
 */
export const useRaffleEventCreateTimesItemMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseRaffleEventCreateTimesItemMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<RaffleEventTimesSchema, ErrorModel, number>(
    (raffleId) => postRaffleEventCreateTimesItem(raffleId),
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
