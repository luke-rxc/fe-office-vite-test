import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { updateContentList } from '../../apis';
import { toContentListUpdateParamsModel } from '../../models';

type MutationParams = Parameters<typeof toContentListUpdateParamsModel>[0];

type MutationResponse = Awaited<ReturnType<typeof updateContentList>>;

type UseUpdateContentListMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 콘텐츠(편성/미편성) 수정 Mutation
 */
export const useUpdateContentListMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseUpdateContentListMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(
    (params) => updateContentList(toContentListUpdateParamsModel(params)),
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
