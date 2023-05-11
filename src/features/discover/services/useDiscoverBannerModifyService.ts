import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { DiscoverBannerQueryKeys, DiscoverLandingSubType, DiscoverLandingType } from '../constants';
import {
  useDiscoverBannerModifyMutation,
  useDiscoverBannerDetailQuery,
  useDiscoverBannerLandingMutation,
  useGoodsList,
  useOrder,
  useImageUploader,
} from '../hooks';
import {
  toDiscoverBannerLandingInfoQueryParams,
  toDiscoverBannerLandingInfoModel,
  DiscoverBannerLandingInfoModel,
  toDiscoverBannerInfoParams,
  toDiscoverBannerFormField,
  GoodsModel,
} from '../models';
import { DiscoverBannerInfoParams, DiscoverBannerFormField } from '../types';
import sortBy from 'lodash/sortBy';
import toast from 'react-hot-toast';
import { syncSortNumber } from '../utils';

const defaultFormValues: DiscoverBannerFormField = {
  landingRefId: '',
  landingType: DiscoverLandingType.GOODS,
  landingSubType: '',
  primaryImageFileId: '',
  publishEndDate: '',
  publishStartDate: '',
  subTitle: '',
  title: '',
};

export type ReturnTypeUseDiscoverBannerModifyService = ReturnType<typeof useDiscoverBannerModifyService>;

interface Props {
  bannerId: string;
}

export const useDiscoverBannerModifyService = ({ bannerId }: Props) => {
  const formRef = useRef<HTMLFormElement>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const [landingInfo, setLandingInfo] = useState<DiscoverBannerLandingInfoModel>();
  const formMethod = useForm<DiscoverBannerFormField>({ defaultValues: defaultFormValues });
  const { watch, getValues, reset, setError, setValue, trigger, handleSubmit } = formMethod;

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const { order } = useOrder<GoodsModel>();
  const {
    goodsList: addedGoodsList,
    handleUpdateGoodsList: onUpdateGoodsList,
    handleDeleteGoodsList: onDeleteGoodsList,
  } = useGoodsList();

  // 대표이미지 업로드 관련
  const { onUpdateFileInfo: handleUpdateFileInfo, ...uploader } = useImageUploader({
    formMethod,
    formId: 'primaryImageFileId',
    formLabel: '미디어(이미지)',
  });

  const { data: discoverBannerItem } = useDiscoverBannerDetailQuery(bannerId, {
    onError: (error) => {
      dialog.open({
        type: DialogType.ALERT,
        title: '오류',
        content: `디스커버 상세 정보를 조회중 문제가 발생하였습니다\r\n(${error.data.message})`,
        onClose: () => {
          dialog.close();
          navigate('/display/discover/banner/list');
        },
      });
    },
  });
  const { mutateAsync: getDiscoverBannerLanding } = useDiscoverBannerLandingMutation();
  const { mutateAsync: requestDiscoverBannerModify } = useDiscoverBannerModifyMutation();

  useEffect(() => {
    if (!discoverBannerItem) {
      return;
    }

    const primaryImage: UploadFileInfo = {
      ...discoverBannerItem.primaryImageFile,
      path: discoverBannerItem.primaryImageFile.path,
    };

    onUpdateGoodsList(discoverBannerItem.items);
    handleUpdateFileInfo(primaryImage);
    reset(toDiscoverBannerFormField(discoverBannerItem));
    handleBlurLandingRefId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoverBannerItem]);

  useEffect(() => {
    const subscription = watch(({ landingType }, { name }) => {
      if (name === 'landingType' || name === 'landingSubType') {
        if (name === 'landingType') {
          if (landingType === DiscoverLandingType.CONTENTS) {
            setValue('landingSubType', DiscoverLandingSubType.STORY);
          } else {
            setValue('landingSubType', '');
          }
        }
        setValue('landingRefId', '');
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  /**
   * 디스커버 배너 변경
   */
  const onSubmitModify = async (params: DiscoverBannerInfoParams) => {
    await requestDiscoverBannerModify(params, {
      onSuccess: async () => {
        await queryClient.invalidateQueries(DiscoverBannerQueryKeys.detail(bannerId));
        dialog.open({
          type: DialogType.ALERT,
          title: '변경완료',
          content: '디스커버 배너가 변경되었습니다.',
          onClose: () => {
            navigate('/display/discover/banner/list');
            dialog.close();
          },
        });
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          title: '에러',
          content: `디스커버 배너 변경중 문제가 발생되었습니다.\r\n(${error.data.message})`,
        });
      },
    });
  };

  /**
   * 디스커버 배너 변경 submit
   */
  const handleSubmitModify = handleSubmit(async (values) => {
    const params = { ...toDiscoverBannerInfoParams(values, addedGoodsList), bannerId };

    if (addedGoodsList.length === 0) {
      toast.error('배너에 전시할 상품을 최소 1개 선택하세요.');
      return;
    }

    if (addedGoodsList.length > 8) {
      toast.error('배너에 전시할 상품은 최대 8개까지 가능합니다.');
      return;
    }

    if (params.publishStartDate >= params.publishEndDate) {
      setError('publishEndDate', { message: '종료시간은 편성시간보다 이후 시간으로 설정하세요' });
      return;
    }

    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '디스커버 배너를 변경하시겠습니까?',
      onConfirm: () => {
        onSubmitModify(params);
      },
    });
  });

  /**
   * 디스커버 배너 변경 submit trigger
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

    if (!formValues.landingRefId || isNaN(Number(formValues.landingRefId))) {
      trigger('landingRefId');
      setLandingInfo(undefined);
      return;
    }

    if (landingInfo && formValues.landingRefId === String(landingInfo.referenceId)) {
      return;
    }

    await getDiscoverBannerLanding(toDiscoverBannerLandingInfoQueryParams(formValues), {
      onSuccess: (data) => {
        setLandingInfo(toDiscoverBannerLandingInfoModel(data));
        trigger('landingRefId');
      },
      onError: (error) => {
        setLandingInfo({
          label: error.data.message,
          success: false,
          referenceId: Number(formValues.landingRefId),
        });
        trigger('landingRefId');
      },
    });
  };

  /**
   * 섹션 리스트 업데이트
   */
  const handleUpdateGoodsList = (updateSections: Array<GoodsModel>, type?: 'renew' | 'append') => {
    onUpdateGoodsList(updateSections, type);
    // setSelectedRowKeys([]);
  };

  /**
   * 섹션 리스트 업데이트
   */
  const handleDeleteGoodsList = () => {
    onDeleteGoodsList(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  /**
   * 섹션 리스트 항목선택 키 업데이트
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<string>) => {
    setSelectedRowKeys(sortBy(selectedRowKeys, 'sortNum'));
  };

  /**
   * 섹션 리스트 순서 변경
   */
  const handleOrder = (direction: string) => {
    return () => {
      handleUpdateGoodsList(syncSortNumber(order(direction, addedGoodsList, selectedRowKeys, 'rowKey')));
    };
  };

  /**
   * 리스트 checkbox 상태 처리
   */
  const getCheckboxProps = useCallback(
    () => ({
      disabled: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [discoverBannerItem],
  );

  return {
    formMethod,
    uploader,
    formRef,
    landingInfo,
    addedGoodsList,
    rowSelection: {
      selectedRowKeys,
      onChange: handleChangeRowSelect,
      getCheckboxProps,
    },
    handleSubmitModify,
    handleClickSubmit,
    handleClickCancel,
    handleBlurLandingRefId,
    handleUpdateGoodsList,
    handleDeleteGoodsList,
    handleOrder,
  };
};
