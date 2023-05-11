import { useMutation } from '@hooks/useMutation';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { noop } from 'lodash';
import { useQueryClient } from 'react-query';
import { deleteBanner, deleteBannerPublishingStatus, postBanner, postBannerToPublish, putBanner } from '../apis';
import { MainBannerQueryKeys } from '../constants';
import { MainBannerDetailSchema, MainBannerSchema } from '../schemas';
import {
  DeleteBannerMutationParams,
  DeleteBannerPublishingMutationParams,
  PostBannerMutationParams,
  PostBannerPublishMutationParams,
  PutBannerMutationParams,
} from '../types';

interface ResponseCallback<T> {
  onMutate?: () => void;
  onSuccess: (data: T) => void;
  onError: (error: ErrorModel<ErrorDataModel>) => void;
  onSettled?: () => void;
}

export const useBannerDeletePublishingMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<MainBannerSchema>) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (params: DeleteBannerPublishingMutationParams) => deleteBannerPublishingStatus(params),
    {
      onMutate,
      onSuccess: (data) => {
        queryClient.invalidateQueries(MainBannerQueryKeys.all);
        onSuccess(data);
      },
      onError: (error) => {
        console.error(error);
        onError(error);
      },
      onSettled,
    },
  );

  return { mutate };
};

export const useBannerPostPublishMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<MainBannerSchema>) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation((params: PostBannerPublishMutationParams) => postBannerToPublish(params), {
    onMutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries(MainBannerQueryKeys.all);
      onSuccess(data);
    },
    onError: (error) => {
      onError(error);
      console.error(error);
    },
    onSettled,
  });

  return { mutate };
};

export const useBannerPostMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<MainBannerDetailSchema>) => {
  const { mutate } = useMutation((params: PostBannerMutationParams) => postBanner(params), {
    onMutate,
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error) => {
      onError(error);
      console.error(error);
    },
    onSettled,
  });

  return { mutate };
};

interface UsePutMutationParams
  extends Pick<PutBannerMutationParams, 'homeBannerId'>,
    ResponseCallback<MainBannerDetailSchema> {}

export const useBannerPutMutation = ({
  homeBannerId,
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: UsePutMutationParams) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation((params: PostBannerMutationParams) => putBanner({ ...params, homeBannerId }), {
    onMutate,
    onSuccess: (data) => {
      queryClient.setQueryData(MainBannerQueryKeys.detail({ homeBannerId }), data);
      onSuccess(data);
    },
    onError: (error) => {
      onError(error);
      console.error(error);
    },
    onSettled,
  });

  return { mutate };
};

export const useBannerDeleteMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<void>) => {
  const { mutate } = useMutation((params: DeleteBannerMutationParams) => deleteBanner(params), {
    onMutate,
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      onError(error);
      console.error(error);
    },
    onSettled,
  });

  return { mutate };
};
