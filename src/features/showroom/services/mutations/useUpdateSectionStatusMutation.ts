import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { updateSectionStatus, UpdateSectionStatusParams } from '../../apis';

type MutationParams = UpdateSectionStatusParams;

type MutationResponse = Awaited<ReturnType<typeof updateSectionStatus>>;

type UseUpdateSectionStatusMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 섹션 상태 업데이트 Mutation
 */
export const useUpdateSectionStatusMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseUpdateSectionStatusMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(updateSectionStatus, {
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
