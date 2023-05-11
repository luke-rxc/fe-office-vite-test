import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { getIsValidAddableGoods, GetIsValidAddableGoodsPrams } from '../../apis';
import { toGoodsValidationListModel } from '../../models';

type MutationParams = GetIsValidAddableGoodsPrams;

type MutationResponse = Awaited<ReturnType<typeof toGoodsValidationListModel>>;

type UseCheckAddableGoodsMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 등록 가능한 상품 여부를 판단하기 위한 Mutation
 */
export const useValidAddableGoodsMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseCheckAddableGoodsMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(
    async (params) => await getIsValidAddableGoods(params).then((data) => toGoodsValidationListModel(data)),
    {
      onMutate: (...rest) => {
        !hideSpinner && showLoading();
        onMutate && onMutate(...rest);
      },
      onSettled: (...rest) => {
        !hideSpinner && hideLoading();
        onSettled && onSettled(...rest);
      },
      ...options,
    },
  );
};
