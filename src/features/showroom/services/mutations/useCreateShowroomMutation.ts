import { UseMutationOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { default as useLoading } from '@hooks/useLoading';
import { Awaited, ShowroomFormFields } from '../../types';
import { createShowroom } from '../../apis';
import { toShowroomCreateParamsModel } from '../../models';

type MutationParams = ShowroomFormFields;

type MutationResponse = Awaited<ReturnType<typeof createShowroom>>;

type UseCreateShowroomMutationOptions = UseMutationOptions<MutationResponse, ErrorModel, MutationParams> & {
  hideSpinner?: boolean;
};

/**
 * 쇼룸 생성 Mutation
 */
export const useCreateShowroomMutation = ({
  onMutate,
  onSettled,
  hideSpinner,
  ...options
}: UseCreateShowroomMutationOptions) => {
  const { showLoading, hideLoading } = useLoading();

  return useMutation<MutationResponse, ErrorModel, MutationParams>(
    (params) => createShowroom(toShowroomCreateParamsModel(params)),
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
