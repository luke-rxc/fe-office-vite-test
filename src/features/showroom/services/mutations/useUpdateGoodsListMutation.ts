import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { updateGoodsList } from '../../apis';
import { toGoodsListUpdateParamsModel } from '../../models';

type MutationParams = Parameters<typeof toGoodsListUpdateParamsModel>[0];

type MutationResponse = Awaited<ReturnType<typeof updateGoodsList>>;

type UseUpdateGoodsListMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 전시상품 목록 수정 Mutation
 */
export const useUpdateGoodsListMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseUpdateGoodsListMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(
    (params) => updateGoodsList(toGoodsListUpdateParamsModel(params)),
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
