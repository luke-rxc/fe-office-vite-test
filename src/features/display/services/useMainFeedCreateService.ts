import useLoading from '@hooks/useLoading';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFeedForm, useFeedLandingInfoQuery, useFeedPostMutation } from '.';
import { FormMainFeedLadingTypeOptions, MainFeedLandingTypeLabel } from '../constants';
import { MainFeedLandingType } from '../schemas';

export type UseMainFeedCreateService = ReturnType<typeof useMainFeedCreateService>;

export const useMainFeedCreateService = () => {
  const navigate = useNavigate();
  const {
    formMethods,
    refetchLandingInfo,
    landingInfoParams,
    handleCancel,
    handleInvalid,
    handleSubmit,
    landingTypeTools,
    fileInfos,
  } = useFeedForm();
  const [title, description] = formMethods.watch(['title', 'description']);

  const currentTitleLength = useMemo(() => {
    if (!title) {
      return 0;
    }

    return title.replace(/\n/g, '').length;
  }, [title]);

  const currentDescriptionLength = useMemo(() => {
    if (!description) {
      return 0;
    }

    return description.replace(/\n/g, '').length;
  }, [description]);

  const { data: landingInfo, status: landingInfoStatus } = useFeedLandingInfoQuery(landingInfoParams.value);
  const { showLoading, hideLoading } = useLoading();

  const { mutate } = useFeedPostMutation({
    onMutate: () => {
      showLoading();
    },
    onSuccess: () => {
      back();
      toast.success('생성되었습니다.');
    },
    onError: (error) => {
      toast.error(`생성에 실패했습니다. ${error.data.message}`);
    },
    onSettled: hideLoading,
  });

  const back = () => navigate('/display/home/Feed');

  const onCancel = (isDirty: boolean) => handleCancel(isDirty, back);

  const onSubmit = (data) => {
    if (landingInfoStatus !== 'success') {
      return;
    }

    handleSubmit(mutate)(data);
  };

  const getLandingTypeLabel = (type: MainFeedLandingType) => {
    return MainFeedLandingTypeLabel[type];
  };

  return {
    formMethods,
    landingInfo: {
      value: landingInfo,
      status: landingInfoStatus,
      refetchLandingInfo,
    },
    ...landingTypeTools,
    onCancel,
    onInvalid: handleInvalid,
    onSubmit,
    fileInfos,
    getLandingTypeLabel,
    landingTypeOptions: FormMainFeedLadingTypeOptions,
    currentTitleLength,
    currentDescriptionLength,
  };
};
