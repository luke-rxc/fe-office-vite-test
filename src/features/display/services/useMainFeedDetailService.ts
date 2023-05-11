/* eslint-disable react-hooks/exhaustive-deps */
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import {
  useFeedDeleteMutation,
  useFeedDetailQuery,
  useFeedForm,
  useFeedLandingInfoQuery,
  useFeedPutMutation,
  useMode,
} from '.';
import { FormMainFeedLadingTypeOptions, MainFeedLandingTypeLabel } from '../constants';
import { MainFeedLandingType } from '../schemas';
import { GetFeedQueryParams } from '../types';

interface Props {
  queryParams: GetFeedQueryParams;
}

export type UseMainFeedDetailService = ReturnType<typeof useMainFeedDetailService>;

export const useMainFeedDetailService = ({ queryParams }: Props) => {
  const { data, status } = useFeedDetailQuery(queryParams);
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

  const { mode, toggleEditMode } = useMode();
  const { showLoading, hideLoading } = useLoading();
  const dialog = useDialog();
  const navigate = useNavigate();

  const { mutate: editFeed } = useFeedPutMutation({
    homeFeedId: queryParams.homeFeedId,
    onMutate: () => {
      showLoading();
    },
    onSuccess: () => {
      toggleEditMode();
      toast.success('수정되었습니다.');
    },
    onError: (error) => {
      toast.error(`수정에 실패했습니다. ${error.data.message}`);
    },
    onSettled: hideLoading,
  });

  const { mutate: deleteFeed } = useFeedDeleteMutation({
    onMutate: () => {
      showLoading();
    },
    onSuccess: () => {
      toast.success('삭제되었습니다.');
      navigate('/display/home/feed');
    },
    onError: (error) => {
      toast.error(`삭제에 실패했습니다. ${error.data.message}`);
    },
    onSettled: hideLoading,
  });

  const resetForm = () => formMethods.reset(data.processed.form);

  useEffect(() => {
    if (data) {
      resetForm();
      refetchLandingInfo();
    }

    if (data?.media || data?.media?.thumbnailImage) {
      fileInfos.updateMediaInfo([data?.media?.thumbnailImage || data?.media]);
    }
  }, [data]);

  const onCancel = (isDirty: boolean) => {
    handleCancel(isDirty, () => {
      resetForm();
      toggleEditMode();
    });
  };

  const onSubmit = (data) => {
    if (landingInfoStatus !== 'success') {
      return;
    }

    handleSubmit(editFeed)(data);
  };

  const onDelete = () => {
    dialog.open({
      content: '정말 삭제하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        deleteFeed({
          homeFeedId: queryParams.homeFeedId,
        });
        dialog.close();
      },
    });
  };

  const getLandingTypeLabel = (type: MainFeedLandingType) => {
    return MainFeedLandingTypeLabel[type];
  };

  const onMainTypeChange = (_, value: string) => {
    landingTypeTools.resetSubtype(value);
  };

  return {
    detailData: {
      value: data,
      status,
    },
    landingInfo: {
      value: landingInfo,
      status: landingInfoStatus,
      refetchLandingInfo,
    },
    ...landingTypeTools,
    formMethods,
    fileInfos,
    mode,
    onCancel,
    onEdit: toggleEditMode,
    onInvalid: handleInvalid,
    onSubmit,
    onDelete,
    getLandingTypeLabel,
    landingTypeOptions: FormMainFeedLadingTypeOptions,
    currentTitleLength,
    currentDescriptionLength,
    onMainTypeChange,
  };
};
