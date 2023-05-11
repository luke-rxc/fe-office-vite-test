import useLoading from '@hooks/useLoading';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useBannerForm, useBannerLandingInfoQuery, useBannerPostMutation } from '.';
import { FormMainBannerLadingTypeOptions, MainBannerLandingTypeLabel } from '../constants';
import { MainBannerLandingType } from '../schemas';

export type UseMainBannerCreateService = ReturnType<typeof useMainBannerCreateService>;

export const useMainBannerCreateService = () => {
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
  } = useBannerForm();
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

  const { data: landingInfo, status: landingInfoStatus } = useBannerLandingInfoQuery(landingInfoParams.value);
  const { showLoading, hideLoading } = useLoading();

  const { mutate } = useBannerPostMutation({
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

  const back = () => navigate('/display/home/banner');

  const onCancel = (isDirty: boolean) => handleCancel(isDirty, back);

  const onSubmit = (data) => {
    if (landingInfoStatus !== 'success') {
      return;
    }

    handleSubmit(mutate, data);
  };

  const getLandingTypeLabel = (type: MainBannerLandingType) => {
    return MainBannerLandingTypeLabel[type];
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
    landingTypeOptions: FormMainBannerLadingTypeOptions,
    currentTitleLength,
    currentDescriptionLength,
  };
};
