import { useEdit } from '@features/discover/hooks';
import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadFileType } from '@services/useFileUploader';
import { ErrorModel } from '@utils/api/createAxios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import {
  AllowDuplicateWinnerType,
  EnterDrawConditionType,
  RaffleEventQueryKeys,
  WinnerConditionType,
} from '../constants';
import {
  useLiveComboListQuery,
  useLiveDetailQuery,
  useRaffleEventCopyTimesItemMutation,
  useRaffleEventCreateTimesItemMutation,
  useRaffleEventDetailQuery,
  useRaffleEventSaveMutation,
  useRaffleEventUploader,
  useShowroomComboListQuery,
} from '../hooks';
import {
  toLiveComboModel,
  toRaffleEventDetailFormFieldByItemModel,
  toRaffleEventDetailTimesField,
  toRaffleEventSaveParams,
  toRaffleEventTimesModel,
} from '../models';
import { RaffleEventDetailFormField } from '../types';
import { DropResult } from 'react-beautiful-dnd';

interface Props {
  raffleId: number;
}

const defaultFormValues: RaffleEventDetailFormField = {
  name: '',
  liveItem: null,
  itemList: [],
};

export type ReturnTypeUseRaffleEventDetailService = ReturnType<typeof useRaffleEventDetailService>;

export const useRaffleEventDetailService = ({ raffleId }: Props) => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const dialog = useDialog();
  const { isEdit, handleToggleEdit } = useEdit();
  const queryClient = useQueryClient();
  const [selectedTimesIndex, setselectedTimesIndex] = useState<number>(0);
  const [currentLiveId, setCurrentLiveId] = useState<number>(null);

  const formMethod = useForm<RaffleEventDetailFormField>({
    defaultValues: defaultFormValues,
  });
  const formRef = useRef<HTMLFormElement>();

  const {
    control,
    reset,
    setValue,
    trigger,
    watch,
    handleSubmit,
    formState: { errors },
  } = formMethod;

  const {
    fields: raffleEventTimesFields,
    append,
    move,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'itemList',
  });

  const timesFormItems = watch(`itemList`);
  const timesErrors = (errors['itemList'] || []).map((item) => !!item);

  const onError = (error: ErrorModel, message: string) => {
    dialog.open({
      content: `${message} 문제가 발생하였습니다.\r\n(${error.data.message})`,
      type: DialogType.ALERT,
    });
  };

  const uploader = useRaffleEventUploader({ formMethod, selectedTimesIndex });

  const { data: showroomComboList, isLoading: isLoadingShowroomComboList } = useShowroomComboListQuery();

  const { data: raffleEventDetailItem, isLoading: isLoadingRaffleEventDetailItem } = useRaffleEventDetailQuery(
    raffleId,
    {
      cacheTime: 0,
      onSuccess: (data) => {
        setCurrentLiveId(data.live.id);
      },
    },
  );

  const { data: liveComboList, isLoading: isLoadingLiveComboList } = useLiveComboListQuery({
    select: (data) => {
      const currentOption = data.items.find((item) => item.id === raffleEventDetailItem?.live?.id);
      if (!currentOption && !!raffleEventDetailItem) {
        return toLiveComboModel({
          ...data,
          items: [...data.items, { id: raffleEventDetailItem.live.id, name: raffleEventDetailItem.live.title }],
        });
      }

      return toLiveComboModel(data);
    },
    enabled: !!raffleEventDetailItem,
  });

  const { data: liveShowroomInfo, isLoading: isLoadingLiveShowroomInfo } = useLiveDetailQuery(currentLiveId, {
    enabled: !!currentLiveId,
  });

  const { mutateAsync: requestCreateTimesItem } = useRaffleEventCreateTimesItemMutation({
    onError: (error) => onError(error, '추첨 회차 추가중'),
  });
  const { mutateAsync: requestSaveRaffleEvent } = useRaffleEventSaveMutation({
    onError: (error) => onError(error, '추첨 이벤트 수정중'),
  });
  const { mutateAsync: requestCopyTimesItem } = useRaffleEventCopyTimesItemMutation({
    onError: (error) => onError(error, '추첨 이벤트 복사중'),
  });

  useEffect(() => {
    if (
      isLoadingRaffleEventDetailItem ||
      isLoadingLiveComboList ||
      isLoadingShowroomComboList ||
      isLoadingLiveShowroomInfo
    ) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingRaffleEventDetailItem, isLoadingLiveComboList, isLoadingShowroomComboList, isLoadingLiveShowroomInfo]);

  useEffect(() => {
    const subscription = watch((item, { name }) => {
      switch (name) {
        case `itemList.${selectedTimesIndex}.enterDrawConditionType`:
          if (item.itemList[selectedTimesIndex].enterDrawConditionType === EnterDrawConditionType.NONE) {
            setValue(`itemList.${selectedTimesIndex}.winnerConditionType`, WinnerConditionType.LIVE_AUDIENCE);
          }
          break;

        case 'liveItem':
          setCurrentLiveId(Number(item.liveItem.value));
          break;
      }
      // window.console.log(name, item);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, selectedTimesIndex]);

  useEffect(() => {
    // 회차가 1개일 경우 중복 당첨 설정 중복 당첨 불가로 설정
    if (timesFormItems.length === 1 && timesFormItems[0].allowDuplicateWinner !== AllowDuplicateWinnerType.DENY) {
      setValue(`itemList.0.allowDuplicateWinner`, AllowDuplicateWinnerType.DENY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesFormItems]);

  /**
   * upload 파일 기본값 초기화
   */
  const initializeDefaultUploadFile = useCallback(() => {
    const selectedTimesItemList = raffleEventDetailItem?.itemList || [];
    const fileList = selectedTimesItemList.reduce<Array<Array<UploadFileInfo>>>((target, item) => {
      if (item) {
        const mediaItem = item.fileType === UploadFileType.IMAGE ? item.goodsImage : item.goodsMedia;
        if (mediaItem) {
          const primaryImage: UploadFileInfo = {
            ...mediaItem,
            path: mediaItem.path,
          };
          target.push([primaryImage]);
        } else {
          target.push(null);
        }
      } else {
        target.push(null);
      }
      return target;
    }, []);

    uploader.handleUpdateFileList(fileList);
    if (fileList.length > 0 && fileList[0] && fileList[0][0]) {
      uploader.handleUpdateFile(fileList[0][0], selectedTimesIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleEventDetailItem, selectedTimesIndex]);

  useEffect(() => {
    const initailize = () => {
      initializeDefaultUploadFile();
      reset(toRaffleEventDetailFormFieldByItemModel(raffleEventDetailItem, liveComboList));
    };

    if (liveComboList && raffleEventDetailItem) {
      initailize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleEventDetailItem, liveComboList]);

  /**
   * 래플 이벤트 수정 처리
   */
  const handleModifyRaffleEvent = async (values: RaffleEventDetailFormField) => {
    const params = toRaffleEventSaveParams({
      ...values,
      id: raffleId,
    });
    await requestSaveRaffleEvent(params);

    dialog.open({
      title: '알림',
      content: '수정이 완료되었습니다.',
      type: DialogType.ALERT,
      onClose: () => {
        dialog.close();
        queryClient.removeQueries(RaffleEventQueryKeys.detail(raffleId));
        queryClient.removeQueries(RaffleEventQueryKeys.lists());
        navigate('/raffle-event/list');
      },
    });
  };

  /**
   * 래플 이벤트 수정 submit
   */
  const handleSubmitModifyRaffleEvent = handleSubmit(
    async (values) => {
      window.console.log(values);
      if ((values.itemList || []).length === 0 || (raffleEventTimesFields || []).length === 0) {
        toast.error('추첨 회차를 1개이상 추가해주세요.');
        return;
      }

      dialog.open({
        title: '확인',
        content: '추첨 이벤트를 수정하시겠습니까?',
        type: DialogType.CONFIRM,
        onConfirm: () => handleModifyRaffleEvent(values),
      });
    },
    (e) => {
      window.console.log(e);
      toast.error('입력이 정확하지 않은 항목이 있습니다.');
    },
  );

  /**
   * 래플 이벤트 수정모드
   */
  const handleEdit = () => {
    handleToggleEdit(true);
  };

  /**
   * 래플 이벤트 수정모드 취소
   */
  const handleCancelEdit = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: `정말 취소하시나요?\r\n작성된 내용은 저장되지 않습니다.`,
      onConfirm: () => {
        initializeDefaultUploadFile();
        reset(toRaffleEventDetailFormFieldByItemModel(raffleEventDetailItem, liveComboList));
        handleToggleEdit(false);
        dialog.close();
      },
      confirmText: '확인',
      closeText: '닫기',
    });
  };

  /**
   * submit button click
   */
  const handleClickSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  /**
   * change tab
   */
  const handleChangeTab = (index: number) => {
    setselectedTimesIndex((prev) => (prev !== index ? index : prev));
  };

  /**
   * 추첨 회차 리스트 순서 업데이트
   */
  const handleUpdateTimesList = ({ source, destination }: DropResult): Promise<void> => {
    if (!destination) return;
    if (destination.index === source.index) return;

    const selectedId = raffleEventTimesFields[selectedTimesIndex].id;
    const newTabs = Array.from(raffleEventTimesFields);
    const [removed] = newTabs.splice(source.index, 1);
    newTabs.splice(destination.index, 0, removed);
    move(source.index, destination.index);
    uploader.handleMoveUploadFile(source.index, destination.index);

    const changedIndex = newTabs.findIndex((tab) => tab.id === selectedId);
    handleChangeTab(changedIndex);
  };

  /**
   * 추첨 회차 추가
   */
  const handleAppendTimesItem = async () => {
    const updateIndex = raffleEventTimesFields.length;
    const timesItem = await requestCreateTimesItem(raffleId);

    const convertItem = toRaffleEventTimesModel(timesItem);
    const formItem = toRaffleEventDetailTimesField(convertItem);

    append({ ...formItem });
    update(updateIndex, { ...formItem });
    uploader.handleAppendUploadFile(null);
    handleChangeTab(timesFormItems.length);
  };

  /**
   * 추첨 회차 삭제
   */
  const handleRemoveTimesItem = () => {
    dialog.open({
      title: '확인',
      content: `선택한 추첨 회차를 삭제하시겠습니까? (id: ${raffleEventTimesFields[selectedTimesIndex].itemId})`,
      type: DialogType.CONFIRM,
      onConfirm: () => {
        uploader.handleRemoveFileListItem(selectedTimesIndex);
        remove(selectedTimesIndex);
        handleChangeTab(0);
        dialog.close();
      },
    });
  };

  /**
   * 추첨 회차 복사
   */
  const handleCopyTimesItem = async () => {
    const { id: itemId } = await requestCopyTimesItem({
      raffleId,
      raffleItemId: raffleEventTimesFields[selectedTimesIndex].itemId,
    });

    const copyFormItem = timesFormItems[selectedTimesIndex];
    append({ ...copyFormItem, itemId });
    update(timesFormItems.length, { ...copyFormItem, itemId });

    // 회차 복사시 선택회차 뒤로 처리 (기능제거로 일단 주석처리)
    // if (timesFormItems.length !== selectedTimesIndex + 1) {
    //   window.console.log('move', timesFormItems.length, selectedTimesIndex + 1);
    //   move(timesFormItems.length, selectedTimesIndex + 1);
    // }
    // uploader.handleAppendUploadFile(uploader.uploadFileList[selectedTimesIndex], selectedTimesIndex + 1);

    uploader.handleAppendUploadFile(uploader.uploadFileList[selectedTimesIndex]);
    handleChangeTab(timesFormItems.length);
  };

  /**
   * 이미지/동영상 업로드 처리
   */
  const handleChangeUploadFile = async (fileInfos: Array<UploadFileInfo>) => {
    showLoading();
    const { id, fileType } = await uploader.handleChangeUploadFile(fileInfos);
    setValue(`itemList.${selectedTimesIndex}.mediaId`, id.toString());
    setValue(`itemList.${selectedTimesIndex}.fileType`, fileType);
    trigger(`itemList.${selectedTimesIndex}.mediaId`);
    hideLoading();
  };

  /**
   * 이미지/동영상 삭제
   */
  const handleRemoveUploadFile = (index: number) => {
    uploader.handleRemoveUploadFile(index);
    setValue(`itemList.${selectedTimesIndex}.mediaChromakey`, false);
    setValue(`itemList.${selectedTimesIndex}.mediaId`, '');
    setValue(`itemList.${selectedTimesIndex}.fileType`, '');
    trigger(`itemList.${selectedTimesIndex}.mediaId`);
  };

  return {
    raffleEventDetailItem,
    liveId: currentLiveId,
    liveComboList,
    showroomComboList,
    liveShowroomInfo,
    selectedTimesIndex,
    form: {
      formRef,
      formMethod,
      raffleEventTimesFields,
      onSubmitModifyRaffleEvent: handleSubmitModifyRaffleEvent,
    },
    edit: {
      isEdit,
      onClickEdit: handleEdit,
      onCancelEdit: handleCancelEdit,
      onClickSubmit: handleClickSubmit,
    },
    uploader: {
      contents: uploader.fileInfos,
      onChangeUploadFile: handleChangeUploadFile,
      onRemoveUploadFile: handleRemoveUploadFile,
    },
    tabs: {
      activeIndex: selectedTimesIndex,
      isDragDisabled: !isEdit,
      items: raffleEventTimesFields,
      errors: timesErrors,
      onChangeTab: handleChangeTab,
      onUpdateItems: handleUpdateTimesList,
    },
    actions: {
      onClickAppendTimesItem: handleAppendTimesItem,
      onClickRemoveTimesItem: handleRemoveTimesItem,
      onClickCopyTimesItem: handleCopyTimesItem,
    },
  };
};
