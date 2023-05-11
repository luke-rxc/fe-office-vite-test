import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { updateSectionInfo } from '../../apis';
import { toSectionListParamsModel } from '../../models';

type MutationParams = Parameters<typeof toSectionListParamsModel>[0];

type MutationResponse = Awaited<ReturnType<typeof updateSectionInfo>>;

type UseUpdateSectionInfoMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 섹션 정보 업데이트 Mutation
 */
export const useUpdateSectionInfoMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseUpdateSectionInfoMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(
    (params) => updateSectionInfo(toSectionListParamsModel(params)),
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
