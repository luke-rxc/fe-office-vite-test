import toast from 'react-hot-toast';
import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { excelExport } from '@utils/excel';
import { ExportExcelSchema } from '../../schemas';
import { toExcelByProviderSettlementListParamsModel, toExcelByProviderSettlementListModel } from '../../models';
import { ProviderSettlementSearchForm } from '../../types';
import { getExcelAllListByProviderSettlement } from '../../apis';

export interface UseProviderSettlementListForExcelMutationOptions
  extends UseMutationOptions<ExportExcelSchema, ErrorModel, ProviderSettlementSearchForm> {
  displaySpinner?: boolean;
  errorToastMsg?: string;
  displayErrorToast?: boolean;
  successToastMsg?: string;
  displaySuccessToast?: boolean;
  exportExcelFile?: boolean;
}

/** 엑셀용 입점사별 모든 정산 데이터 조회 Mutation === 전체다운로드 */
export const useExcelByProviderSettlementListMutation = ({
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
}: UseProviderSettlementListForExcelMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<ExportExcelSchema, ErrorModel, ProviderSettlementSearchForm>(
    (params) => getExcelAllListByProviderSettlement(toExcelByProviderSettlementListParamsModel(params)),
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
          excelExport(toExcelByProviderSettlementListModel(data, variables));
        }

        onSuccess && onSuccess(data, variables, context);
      },
      ...options,
    },
  );
};
