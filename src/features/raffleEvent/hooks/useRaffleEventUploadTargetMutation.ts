import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postRaffleEventUploadTargetUser } from '../apis';
import { RaffleEventUserUploadParams } from '../types';
import { RaffleEventUserExcelResponseSchema } from '../schemas';

export interface UseRaffleEventUploadTargetMutationOptions
  extends UseMutationOptions<RaffleEventUserExcelResponseSchema, ErrorModel, RaffleEventUserUploadParams> {
  displaySpinner?: boolean;
}

/**
 * 래플 이벤트 응모 대상 업로드 mutation
 */
export const useRaffleEventUploadTargetMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseRaffleEventUploadTargetMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<RaffleEventUserExcelResponseSchema, ErrorModel, RaffleEventUserUploadParams>(
    (params) => postRaffleEventUploadTargetUser(params),
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
