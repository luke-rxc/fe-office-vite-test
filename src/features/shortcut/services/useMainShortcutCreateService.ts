import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { UploadFileType } from '@services/useFileUploader';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import {
  MainShortcutLandingSubType,
  MainShortcutLandingMainType,
  MainShortcutTitleType,
  MainShortcutDescriptionType,
  MainShortcutVideoPlayType,
  MainShortcutQueryKeys,
} from '../constants';
import { useImageUploader, useMainShortcutCreateMutation, useMainShortcutLandingMutation } from '../hooks';
import {
  toMainShortcutLandingInfoQueryParams,
  toMainShortcutLandingInfoModel,
  MainShortcutLandingInfoModel,
  toMainShortcutInfoParams,
} from '../models';
import { MainShortcutInfoParams, MainShortcutFormField } from '../types';

const defaultFormValues: MainShortcutFormField = {
  referenceId: '',
  landingType: MainShortcutLandingMainType.CONTENTS,
  landingSubType: MainShortcutLandingSubType.STORY,
  mediaId: '',
  mediaThumbnailId: '',
  publishEndDate: '',
  publishStartDate: '',
  description: '',
  descriptionType: MainShortcutDescriptionType.NONE,
  title: '',
  sortNum: '',
  titleImageSvgId: '',
  titleImageLottieId: '',
  titleType: MainShortcutTitleType.NONE,
  videoRepeatType: MainShortcutVideoPlayType.ONCE,
};

export type ReturnTypeUseMainShortcutCreateService = ReturnType<typeof useMainShortcutCreateService>;

export const useMainShortcutCreateService = () => {
  const formRef = useRef<HTMLFormElement>();
  const navigate = useNavigate();
  const dialog = useDialog();
  const queryClient = useQueryClient();

  const [landingInfo, setLandingInfo] = useState<MainShortcutLandingInfoModel>();
  const formMethod = useForm<MainShortcutFormField>({ defaultValues: defaultFormValues });
  const { watch, getValues, setError, setValue, trigger, handleSubmit } = formMethod;

  const primaryImageUploader = useImageUploader({ formMethod, formId: 'mediaId', formLabel: '미디어(백그라운드)' });
  const primaryThumbnailImageUploader = useImageUploader({
    formMethod,
    formId: 'mediaThumbnailId',
    formLabel: '동영상 썸네일',
  });
  const titleImageSvgUploader = useImageUploader({
    formMethod,
    formId: 'titleImageSvgId',
    formLabel: '타이틀 이미지(svg)',
  });
  const titleImageLottieUploader = useImageUploader({
    formMethod,
    formId: 'titleImageLottieId',
    formLabel: '타이틀 이미지(lottie)',
  });
  const isVideoMediaType =
    primaryImageUploader.contents.length > 0
      ? primaryImageUploader.contents[0].fileType === UploadFileType.VIDEO
      : false;

  const { mutateAsync: getMainShortcutLanding } = useMainShortcutLandingMutation();
  const { mutateAsync: requestMainShortcutCreate } = useMainShortcutCreateMutation();

  useEffect(() => {
    const subscription = watch(({ landingType }, { name }) => {
      if (name === 'landingType' || name === 'landingSubType') {
        if (name === 'landingType') {
          if (landingType === MainShortcutLandingMainType.CONTENTS) {
            setValue('landingSubType', MainShortcutLandingSubType.STORY);
          } else {
            setValue('landingSubType', '');
          }
        }
        setLandingInfo(null);
        setValue('referenceId', '');
        trigger('referenceId');
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  /**
   * 숏컷 배너 등록
   */
  const onSubmitCreate = async (params: MainShortcutInfoParams) => {
    await requestMainShortcutCreate(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(MainShortcutQueryKeys.all);
        dialog.open({
          type: DialogType.ALERT,
          title: '등록완료',
          content: '숏컷 배너가 등록되었습니다.',
          onClose: () => {
            navigate('/display/home/shortcut');
            dialog.close();
          },
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `숏컷 배너 등록중 문제가 발생되었습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 숏컷 배너 등록 submit
   */
  const handleSubmitCreate = handleSubmit(async (values) => {
    const params = toMainShortcutInfoParams(values, isVideoMediaType);

    if (params.publishStartDate >= params.publishEndDate) {
      setError('publishEndDate', { message: '종료시간은 편성시간보다 이후 시간으로 설정하세요' });
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '숏컷 배너를 등록하시겠습니까?',
      onConfirm: () => {
        onSubmitCreate(params);
      },
    });
  });

  /**
   * 숏컷 배너 신규생성 submit trigger
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  /**
   * 취소(이전페이지 이동)
   */
  const handleClickCancel = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `정말 취소하시나요?\r\n작성된 내용은 저장되지 않습니다.`,
      onConfirm: () => {
        navigate(-1);
        dialog.close();
      },
      confirmText: '확인',
      closeText: '닫기',
    });
  };

  /**
   * 랜딩 상세정보 blur event
   */
  const handleBlurLandingRefId = async () => {
    const formValues = getValues();

    if (!formValues.referenceId || isNaN(Number(formValues.referenceId))) {
      trigger('referenceId');
      setLandingInfo(null);
      return;
    }

    if (landingInfo && formValues.referenceId === String(landingInfo.referenceId)) {
      return;
    }

    await getMainShortcutLanding(toMainShortcutLandingInfoQueryParams(formValues), {
      onSuccess: (data) => {
        setLandingInfo(toMainShortcutLandingInfoModel(data));
        trigger('referenceId');
      },
      onError: (error) => {
        setLandingInfo({
          label: error.data.message,
          success: false,
          referenceId: Number(formValues.referenceId),
        });
        trigger('referenceId');
      },
    });
  };

  return {
    formMethod,
    primaryImageUploader,
    primaryThumbnailImageUploader,
    titleImageSvgUploader,
    titleImageLottieUploader,
    isVideoMediaType,
    formRef,
    landingInfo,
    handleSubmitCreate,
    handleClickSubmit,
    handleClickCancel,
    handleBlurLandingRefId,
  };
};
