import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { OrderExportDeliveryInfoParams } from '../types';
import { putOrderExportDeliveryInfo } from '../apis';

export interface UseOrderDeliveryInfoModifyMutationOptions
  extends UseMutationOptions<string, ErrorModel, OrderExportDeliveryInfoParams> {
  displaySpinner?: boolean;
}

/**
 * 운송 정보 수정 mutation
 */
export const useOrderExportDeliveryInfoModifyMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: UseOrderDeliveryInfoModifyMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<string, ErrorModel, OrderExportDeliveryInfoParams>(
    (params) => putOrderExportDeliveryInfo(params),
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
