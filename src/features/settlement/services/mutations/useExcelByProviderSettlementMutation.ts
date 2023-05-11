import toast from 'react-hot-toast';
import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { excelExport } from '@utils/excel';
import { ExportExcelSchema } from '../../schemas';
import { toExcelByProviderSettlementModel } from '../../models';
import { ProviderSettlementListItem } from '../../types';
import { getExcelByProviderSettlement } from '../../apis';

export interface UseProviderSettlementForExcelMutationOptions
  extends UseMutationOptions<ExportExcelSchema, ErrorModel, ProviderSettlementListItem> {
  displaySpinner?: boolean;
  errorToastMsg?: string;
  displayErrorToast?: boolean;
  successToastMsg?: string;
  displaySuccessToast?: boolean;
  exportExcelFile?: boolean;
}

/** 엑셀용 입점사별 특정 정산 데이터 조회 Mutation */
export const useExcelByProviderSettlementMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  errorToastMsg,
  displayErrorToast = true,
  successToastMsg,
  displaySuccessToast = true,
  exportExcelFile = true,
  ...options
}: UseProviderSettlementForExcelMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<ExportExcelSchema, ErrorModel, ProviderSettlementListItem>(
    ({ id }) => getExcelByProviderSettlement({ id }),
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
      onSuccess: (data, variables, context) => {
        // excel export
        if (exportExcelFile) {
          displaySuccessToast && toast.success(successToastMsg || '파일을 다운로드합니다');
          excelExport(toExcelByProviderSettlementModel(data, variables));
        }

        onSuccess && onSuccess(data, variables, context);
      },
      ...options,
    },
  );
};
