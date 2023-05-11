import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { DialogType } from '@models/DialogModel';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadDomainType, useFileUploader } from '@services/useFileUploader';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registShowtimeContents } from '../apis';
import { ContentsType, OpenStatus, OrderingType, PIPMode } from '../constants';
import { toAuctionGoodsRequestParamItemList, toShowtimeContentsRequestParamItem } from '../models';
import { AuctionGoodsItem, GoodsItem, ShowtimeContentsItemFormField, ShowtimeContentsRequestParamItem } from '../types';
import { getOrderedItems } from '../utils';

export const useShowtimeContentsCreateService = (contentsType: ContentsType) => {
  const navigate = useNavigate();
  // 추가된 상품 목록
  const [addedGoodsItems, setAddedGoodsItems] = useState<Array<GoodsItem>>([]);
  // 추가된 경매상품 목록
  const [addedAuctionGoodsItems, setAddedAuctionGoodsItems] = useState<Array<AuctionGoodsItem>>([]);

  const { open: dialogOpen, close: dialogClose } = useDialog();

  // 대표이미지 업로드 관련
  const { fileInfos, handleUpdateFileInfo, handleUpload, handleRemove } = useFileUploader({
    domainType: UploadDomainType.GOODS,
    initFileInfos: [],
  });

  const formMethod = useForm<ShowtimeContentsItemFormField>({
    defaultValues: {
      title: '',
      description: '',
      showRoomId: null,
      liveStartDate: '',
      livePlayTime: '',
      openStatus: OpenStatus.PRIVATE,
      primaryImageId: '',
      guestShowRoomIds: [],
      pushTitle: '',
      pushContents: '',
      pipMode: PIPMode.ON,
      auctionGoodsInfo: '',
    },
  });
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = formMethod;

  const primaryImageError = errors['primaryImageId'];

  useEffect(() => {
    register('primaryImageId', { required: '대표이미지를 선택해주세요' });
    return () => {
      setAddedGoodsItems([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutateAsync: registContents } = useMutation(
    (item: ShowtimeContentsRequestParamItem) => {
      return registShowtimeContents(item);
    },
    {
      onError: (error) => {
        dialogOpen({
          content: `등록 처리중 문제가 발생하였습니다.\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  /**
   * 라이브 등록 submit
   */
  const onSubmit = handleSubmit(async (values) => {
    const params = toShowtimeContentsRequestParamItem(values, contentsType);

    // 라이브 contentsType 경매타입에 일반상품 있고 경매상품 없는 경우 에러처리
    if (contentsType === ContentsType.AUCTION && addedGoodsItems.length > 0 && addedAuctionGoodsItems.length === 0) {
      setError('auctionGoodsInfo', {
        type: 'required',
        message: '경매상품을 1개 이상 추가해주세요',
      });
      return;
    }

    if (addedGoodsItems.length > 0) {
      params.normalGoodsIds = addedGoodsItems.map((item) => item.id);
    }

    if (addedAuctionGoodsItems.length > 0) {
      params.auctionGoodsList = toAuctionGoodsRequestParamItemList(addedAuctionGoodsItems);
    }

    dialogOpen({
      title: '확인',
      content: '등록하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        dialogOpen({
          content: '진행중입니다. 잠시만 기다려주세요.',
          type: DialogType.ALERT,
        });

        await registContents(params);

        dialogOpen({
          title: '알림',
          content: '등록이 완료되었습니다.',
          type: DialogType.ALERT,
          onClose: () => {
            dialogClose();
            navigate('/showtime/contents/list');
          },
        });
      },
      onClose: dialogClose,
    });
  });

  /**
   * 상품 item update
   */
  const handleUpdateGoodsItem = (items: Array<GoodsItem>) => {
    setAddedGoodsItems(items);
  };

  /**
   * 상품 item remove
   */
  const handleRemoveGoodsItem = (id: number) => {
    clearErrors('auctionGoodsInfo');
    setAddedGoodsItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * 경매상품 item update
   */
  const handleUpdateAuctionGoodsItem = (items: Array<AuctionGoodsItem>) => {
    clearErrors('auctionGoodsInfo');
    setAddedAuctionGoodsItems(items);
  };

  /**
   * 경매상품 item remove
   */
  const handleRemoveAuctionGoodsItem = (itemIndex: number) => {
    setAddedAuctionGoodsItems((prev) => prev.filter((_, index) => index !== itemIndex));
  };

  /**
   * 파일 업로드 change
   */
  const handleChangeUploadFile = async (fileInfos: Array<UploadFileInfo>) => {
    try {
      const uploadFiles = await handleUpload(fileInfos);
      handleUpdateFileInfo(uploadFiles, true);
      setValue('primaryImageId', uploadFiles[0].id.toString());
      trigger('primaryImageId');
    } catch (e) {
      dialogOpen({
        content: '대표이미지 업로드에 문제가 발생하였습니다. 다시 확인해주세요.',
        type: DialogType.ALERT,
      });
    }
  };

  /**
   * 업로드 파일 제거
   */
  const handleRemoveUploadFile = (index: number) => {
    handleRemove(index);
    setValue('primaryImageId', '');
    trigger('primaryImageId');
  };

  /**
   * 순서 변경
   */
  const handleClickChangeOrdering = (index: number, orderingType: OrderingType) => {
    return () => {
      const orderedItems = getOrderedItems(addedGoodsItems, index, orderingType);
      setAddedGoodsItems(orderedItems);
    };
  };

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
    },
    goods: {
      addedGoodsItems,
      handleUpdateGoodsItem,
      handleRemoveGoodsItem,
      handleClickChangeOrdering,
    },
    auctionGoods: {
      addedAuctionGoodsItems,
      handleUpdateAuctionGoodsItem,
      handleRemoveAuctionGoodsItem,
    },
    uploader: {
      fileInfos,
      primaryImageError,
      handleChangeUploadFile,
      handleRemoveUploadFile,
    },
  };
};
