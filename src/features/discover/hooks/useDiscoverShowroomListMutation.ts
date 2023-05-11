import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { getShowroomList } from '../apis';
import { ShowroomSearchParams } from '../types';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { ShowroomSchema } from '../schemas';

export interface useDiscoverShowroomListMutationOptions
  extends UseMutationOptions<PaginationResponse<ShowroomSchema>, ErrorModel, ShowroomSearchParams> {
  displaySpinner?: boolean;
}

/**
 * 쇼룸 리스트 조회 mutation
 */
export const useDiscoverShowroomListMutation = ({
  onMutate,
  onSettled,
  onError,
  onSuccess,
  displaySpinner = true,
  ...options
}: useDiscoverShowroomListMutationOptions = {}) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<PaginationResponse<ShowroomSchema>, ErrorModel, ShowroomSearchParams>(
    (params) => getShowroomList(params),
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
        onError && onError(error, ...rest);
      },
      onSuccess: (...rest) => {
        onSuccess && onSuccess(...rest);
      },
      ...options,
    },
  );
};
