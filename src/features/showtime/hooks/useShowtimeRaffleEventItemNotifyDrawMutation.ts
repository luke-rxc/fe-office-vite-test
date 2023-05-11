import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { ShowtimeRaffleEventItemDrawParams } from '../types';
import { ShowtimeRaffleEventDetailItemSchema } from '../schemas';
import { putShowtimeRaffleItemNotifyDraw } from '../apis';

export interface UseShowtimeRaffleEventItemNotifyDrawMutationOptions
  extends UseMutationOptions<ShowtimeRaffleEventDetailItemSchema, ErrorModel, ShowtimeRaffleEventItemDrawParams> {
  displaySpinner?: boolean;
}

/**
 * 라이브 래플 이벤트 당첨자 발표 mutation
 */
export const useShowtimeRaffleEventItemNotifyDrawMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseShowtimeRaffleEventItemNotifyDrawMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<ShowtimeRaffleEventDetailItemSchema, ErrorModel, ShowtimeRaffleEventItemDrawParams>(
    (parmas) => putShowtimeRaffleItemNotifyDraw(parmas),
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
