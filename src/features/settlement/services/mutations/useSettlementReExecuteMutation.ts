import toast from 'react-hot-toast';
import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { postSettlementReExecute, PostSettlementReExecuteParams } from '../../apis';

export interface UseSettlementReExecuteMutationOptions
  extends UseMutationOptions<unknown, ErrorModel, PostSettlementReExecuteParams> {
  displaySpinner?: boolean;
  errorToastMsg?: string;
  displayErrorToast?: boolean;
  successToastMsg?: string;
  displaySuccessToast?: boolean;
}

/** 재정산요청 Mutation */
export const useSettlementReExecuteMutation = ({
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
}: UseSettlementReExecuteMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<unknown, ErrorModel, PostSettlementReExecuteParams>((params) => postSettlementReExecute(params), {
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
      displaySuccessToast && toast.success(successToastMsg || '재정산 요청 완료');
      onSuccess && onSuccess(...rest);
    },
    ...options,
  });
};
