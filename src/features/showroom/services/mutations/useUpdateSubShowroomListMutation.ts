import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited } from '../../types';
import { updateSubShowroomList, UpdateSubShowroomListParams } from '../../apis';

type MutationParams = UpdateSubShowroomListParams;

type MutationResponse = Awaited<ReturnType<typeof updateSubShowroomList>>;

type UseUpdateSubShowroomListMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 소속쇼룸 목록 수정 Mutation
 */
export const useUpdateSubShowroomListMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseUpdateSubShowroomListMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(updateSubShowroomList, {
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
