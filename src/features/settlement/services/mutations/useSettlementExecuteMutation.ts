import toast from 'react-hot-toast';
import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { SettlementItemSchema } from '../../schemas';
import { SettlementListItem } from '../../types';
import { postSettlementExecute } from '../../apis';
import { toSettlementExecuteParamsModel } from '../../models';
export interface UseSettlementExecuteMutationOptions
  extends UseMutationOptions<unknown, ErrorModel, SettlementItemSchema> {
  displaySpinner?: boolean;
  errorToastMsg?: string;
  displayErrorToast?: boolean;
  successToastMsg?: string;
  displaySuccessToast?: boolean;
}

export const useSettlementExecuteMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  errorToastMsg,
  displayErrorToast = true,
  successToastMsg,
  displaySuccessToast = true,
  ...options
}: UseSettlementExecuteMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<unknown, ErrorModel, SettlementListItem>(
    (params) => postSettlementExecute(toSettlementExecuteParamsModel(params)),
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
        displayErrorToast && toast.error(errorToastMsg || error.data.message);
        onError && onError(error, ...rest);
      },
      onSuccess: (...rest) => {
        displaySuccessToast && toast.success(successToastMsg || '정산 요청 완료');
        onSuccess && onSuccess(...rest);
      },
      ...options,
    },
  );
};
