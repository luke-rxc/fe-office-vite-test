import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { createSection } from '../../apis';
import { toSectionCreateParamsModel } from '../../models';

type MutationParams = Parameters<typeof toSectionCreateParamsModel>[0];

type MutationResponse = Awaited<ReturnType<typeof createSection>>;

type UseCreateSectionMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 섹션 생성 Mutation
 */
export const useCreateSectionMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseCreateSectionMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(
    (params) => createSection(toSectionCreateParamsModel(params)),
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
