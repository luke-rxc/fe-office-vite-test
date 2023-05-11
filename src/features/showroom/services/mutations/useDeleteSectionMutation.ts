import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { deleteSection, DeleteSectionParams } from '../../apis';

type MutationParams = DeleteSectionParams;

type MutationResponse = Awaited<ReturnType<typeof deleteSection>>;

type UseDeleteSectionMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 섹션 삭제 Mutation
 */
export const useDeleteSectionMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseDeleteSectionMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(deleteSection, {
    onMutate: (...rest) => {
      !hideSpinner && showLoading();
      onMutate && onMutate(...rest);
    },
    onSettled: (...rest) => {
      !hideSpinner && hideLoading();
      onSettled && onSettled(...rest);
    },
    ...options,
  });
};
