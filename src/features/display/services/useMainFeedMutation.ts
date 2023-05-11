import { useMutation } from '@hooks/useMutation';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { noop } from 'lodash';
import { useQueryClient } from 'react-query';
import { deleteFeed, deleteFeedPublishingStatus, postFeed, postFeedToPublish, putFeed } from '../apis/feed';
import { MainFeedQueryKeys } from '../constants';
import { MainFeedDetailSchema, MainFeedSchema } from '../schemas';
import {
  DeleteFeedMutationParams,
  DeleteFeedPublishingMutationParams,
  PostFeedMutationParams,
  PostFeedPublishMutationParams,
  PutFeedMutationParams,
} from '../types';

interface ResponseCallback<T> {
  onMutate?: () => void;
  onSuccess: (data: T) => void;
  onError: (error: ErrorModel<ErrorDataModel>) => void;
  onSettled?: () => void;
}

export const useFeedDeletePublishingMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<MainFeedSchema>) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation((params: DeleteFeedPublishingMutationParams) => deleteFeedPublishingStatus(params), {
    onMutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries(MainFeedQueryKeys.all);
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

export const useFeedPostPublishMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<MainFeedSchema>) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation((params: PostFeedPublishMutationParams) => postFeedToPublish(params), {
    onMutate,
    onSuccess: (data) => {
      queryClient.invalidateQueries(MainFeedQueryKeys.all);
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

export const useFeedPostMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<MainFeedDetailSchema>) => {
  const { mutate } = useMutation((params: PostFeedMutationParams) => postFeed(params), {
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
  extends Pick<PutFeedMutationParams, 'homeFeedId'>,
    ResponseCallback<MainFeedDetailSchema> {}

export const useFeedPutMutation = ({
  homeFeedId,
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: UsePutMutationParams) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation((params: PostFeedMutationParams) => putFeed({ ...params, homeFeedId }), {
    onMutate,
    onSuccess: (data) => {
      queryClient.setQueryData(MainFeedQueryKeys.detail({ homeFeedId }), data);
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

export const useFeedDeleteMutation = ({
  onMutate = noop,
  onSuccess,
  onError,
  onSettled = noop,
}: ResponseCallback<void>) => {
  const { mutate } = useMutation((params: DeleteFeedMutationParams) => deleteFeed(params), {
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
