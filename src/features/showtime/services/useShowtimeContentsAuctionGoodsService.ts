import { useQuery } from '@hooks/useQuery';
import { UploadFileInfo } from '@models/UploadModel';
import { useFileUploader, UploadDomainType, UploadFileType, VideoPlayType } from '@services/useFileUploader';
import { toDateFormat } from '@utils/date';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { getTicketGoodsCombo } from '../apis';
import {
  ModalType,
  AuctionUploadType,
  ShowtimeKeywordUpdateType,
  ticketGoodsComboListQueryKey,
  AuctionGoodsType,
  OrderingType,
} from '../constants';
import { KeywordComboItemModel, toShowtimeContentsRequestParamActionGoods, toTicketGoodsInfoModel } from '../models';
import { AuctionGoodsItem, ShowtimeContentsAuctionGoodsFormField } from '../types';
import { getOrderedItems } from '../utils';

interface Props {
  addedAuctionGoodsItems: Array<AuctionGoodsItem>;
  handleUpdateAuctionGoodsItem: (items: Array<AuctionGoodsItem>) => void;
  handleRemoveAuctionGoodsItem: (id: number) => void;
}

export type ReturnTypeUseShowtimeContentsAuctionGoodsService = ReturnType<
  typeof useShowtimeContentsAuctionGoodsService
>;

/**
 * 경매상품 관련 service
 */
export const useShowtimeContentsAuctionGoodsService = ({
  addedAuctionGoodsItems,
  handleUpdateAuctionGoodsItem,
  handleRemoveAuctionGoodsItem,
}: Props) => {
  // Modal 표시 여부 state
  const [showModal, setShowModal] = useState(false);
  // Modal type state
  const [modalType, setModalType] = useState<ModalType | undefined>(undefined);
  const [modifyAuctionGoodsIndex, setModifyAuctionGoodsIndex] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<Array<KeywordComboItemModel>>([]);

  const initFormValue: ShowtimeContentsAuctionGoodsFormField = {
    name: '',
    startPrice: '',
    bidUnitPrice: '',
    primaryImageId: '',
    goodsFileIds: '',
    description: '',
    displayStartDate: '',
    maximumBidPrice: '',
    usedMaximumBidPrice: false,
    itemType: AuctionGoodsType.GOODS,
    ticketId: '',
    /** 검색태그 */
    searchTags: '',
    /** 부가세 코드 등록 */
    vatCode: null,
  };

  const formMethod = useForm<ShowtimeContentsAuctionGoodsFormField>({
    defaultValues: initFormValue,
  });

  const {
    formState: { errors },
    register,
    reset,
    setValue,
    trigger,
    handleSubmit,
  } = formMethod;
  const primaryImageError = errors['primaryImageId'];
  const goodsFileIdsError = errors['goodsFileIds'];

  const { data: ticketGoodsInfo } = useQuery([ticketGoodsComboListQueryKey], () => getTicketGoodsCombo(), {
    select: (data) => {
      return toTicketGoodsInfoModel(data);
    },
  });

  useEffect(() => {
    register('primaryImageId', { required: '상품 썸네일 이미지를 선택해주세요' });
    register('goodsFileIds', { required: '상품 대표 콘텐츠를 선택해주세요' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 경매상품 대표이미지 uploader
  const primaryImageUploader = useFileUploader({
    domainType: UploadDomainType.LIVE,
    initFileInfos: [],
  });

  // 경매상품 추가이미지 uploader
  const goodsImageUploader = useFileUploader({
    domainType: UploadDomainType.LIVE,
    initFileInfos: [],
  });

  /**
   * 업로드 파일 추가
   * @param {AuctionUploadType} type Upload type
   */
  const handleChangeUploadFile = (type: AuctionUploadType) => {
    return async (fileInfos: Array<UploadFileInfo>) => {
      const isPrimary = type === AuctionUploadType.PRIMARY;
      const targetUploader = isPrimary ? primaryImageUploader : goodsImageUploader;

      try {
        const updateFileInfos = fileInfos.map((item) => {
          if (!isPrimary) {
            return {
              ...item,
              fileType: /^image/.test(item.file.type) ? UploadFileType.IMAGE : UploadFileType.VIDEO,
              videoPlayType: /^image/.test(item.file.type) ? null : VideoPlayType.ONCE,
            };
          }

          return item;
        });
        const uploadFiles = await targetUploader.handleUpload(updateFileInfos);
        targetUploader.handleUpdateFileInfo(uploadFiles, isPrimary);

        if (isPrimary) {
          setValue('primaryImageId', uploadFiles[0].id.toString());
          trigger('primaryImageId');
        } else {
          setValue('goodsFileIds', uploadFiles.map((item) => item.id).join(','));
          trigger('goodsFileIds');
        }
      } catch (e) {
        toast.error('이미지 업로드에 문제가 발생하였습니다. 다시 확인해주세요.');
      }
    };
  };

  /**
   * 업로드 파일 삭제
   * @param {AuctionUploadType} type Upload type
   */
  const handleRemoveUploadFile = (type: AuctionUploadType) => {
    return (index: number) => {
      const isPrimary = type === AuctionUploadType.PRIMARY;
      const targetUploader = isPrimary ? primaryImageUploader : goodsImageUploader;
      targetUploader.handleRemove(index);

      if (isPrimary) {
        setValue('primaryImageId', '');
        trigger('primaryImageId');
      } else {
        setValue('goodsFileIds', '');
        trigger('goodsFileIds');
      }
    };
  };

  /**
   * 경매상품 저장
   */
  const onSubmit = () => {
    handleSubmit((values) => {
      const fileInfo = primaryImageUploader.fileInfos[0];
      const goodsFileInfo = goodsImageUploader.fileInfos;
      const ticketName =
        values.itemType === AuctionGoodsType.TICKET
          ? ticketGoodsInfo.items.find((item) => item.id === Number(values.ticketId)).name
          : '';
      const ticketExpiredInfo =
        values.itemType === AuctionGoodsType.TICKET
          ? ticketGoodsInfo.items.find((item) => item.id === Number(values.ticketId)).info
          : '';

      const auctionGoodsItem = toShowtimeContentsRequestParamActionGoods(
        values,
        fileInfo,
        goodsFileInfo,
        keywords,
        ticketName,
        ticketExpiredInfo,
      );

      if (modalType === ModalType.CREATE) {
        const updateItems = addedAuctionGoodsItems.concat(auctionGoodsItem);
        handleUpdateAuctionGoodsItem(updateItems);
      } else {
        const updateItems = addedAuctionGoodsItems.reduce<Array<AuctionGoodsItem>>((target, item, index) => {
          if (index === modifyAuctionGoodsIndex) {
            target.push({
              ...auctionGoodsItem,
              id: item.id,
              goodsId: item.goodsId,
            });
          } else {
            target.push(item);
          }

          return target;
        }, []);
        handleUpdateAuctionGoodsItem(updateItems);
      }

      setKeywords([]);
      handleClose();
    })();
  };

  /**
   * 경매상품 item 수정
   */
  const handleClickModifyItem = (index: number) => {
    const {
      name,
      startPrice,
      bidUnitPrice,
      primaryImageId,
      primaryImage,
      goodsFileIds,
      goodsFiles,
      description,
      displayStartDate,
      keywordList,
      maximumBidPrice,
      itemType,
      ticketId,
      searchTags,
      vatCode,
    } = addedAuctionGoodsItems[index];

    setModifyAuctionGoodsIndex(index);
    setModalType(ModalType.MODIFY);
    setShowModal(true);

    primaryImageUploader.handleUpdateFileInfo([
      { ...primaryImage, path: primaryImage.path, fileType: UploadFileType.IMAGE },
    ]);
    goodsImageUploader.handleUpdateFileInfo(
      goodsFiles.map((item) => {
        return {
          ...item.file,
          fileType: item.fileType,
          videoPlayType: item.videoPlayType,
        };
      }),
    );

    if (keywordList.length > 0) {
      setKeywords(keywordList);
    }

    reset({
      name,
      startPrice: startPrice.toString(),
      bidUnitPrice: bidUnitPrice.toString(),
      primaryImageId: primaryImageId.toString(),
      goodsFileIds: goodsFileIds.join(','),
      description,
      displayStartDate: toDateFormat(displayStartDate, 'yyyy-MM-dd HH:mm').split(' ').join('T'),
      maximumBidPrice: maximumBidPrice.toString(),
      usedMaximumBidPrice: maximumBidPrice > 0,
      itemType,
      ticketId: ticketId ? ticketId.toString() : '',
      searchTags,
      vatCode,
    });
  };

  /**
   * 경매상품 item 제거
   */
  const handleClickDeleteItem = (index: number) => {
    handleRemoveAuctionGoodsItem(index);
  };

  /**
   * 모달 open
   * @param {ModalType} modalType Modal type
   */
  const handleOpen = (modalType: ModalType) => {
    return () => {
      setModalType(modalType);
      setShowModal(true);
    };
  };

  /**
   * 모달 close
   */
  const handleClose = (event?: unknown, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') {
      return false;
    }

    setModalType(undefined);
    setShowModal(false);
    setModifyAuctionGoodsIndex(null);
    reset(initFormValue);
    primaryImageUploader.handleRemoveAll();
    goodsImageUploader.handleRemoveAll();
  };

  /**
   * 동영상 play type 변경
   */
  const handleChangeVideoPlayType = (id: number, videoPlayType: VideoPlayType) => {
    goodsImageUploader.handleUpdateFileInfo(
      goodsImageUploader.fileInfos.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            videoPlayType,
          };
        }

        return item;
      }),
      true,
    );
  };

  /**
   * 경매상품 키워드 업데이트
   */
  const handleUpdateKeywords = (type: ShowtimeKeywordUpdateType, keywordItem: KeywordComboItemModel) => {
    if (type === ShowtimeKeywordUpdateType.ADD) {
      !keywords.find((keyword) => keyword.value === keywordItem.value) && setKeywords([...keywords, keywordItem]);
    } else {
      setKeywords(keywords.filter((keyword) => keyword.value !== keywordItem.value));
    }
  };

  /**
   * 순서 변경
   */
  const handleClickChangeOrdering = (index: number, orderingType: OrderingType) => {
    return () => {
      const orderedItems = getOrderedItems(addedAuctionGoodsItems, index, orderingType);
      handleUpdateAuctionGoodsItem(orderedItems);
    };
  };

  return {
    auction: {
      modalType,
      showModal,
      formMethod,
      primaryImage: {
        fileInfos: primaryImageUploader.fileInfos,
        error: primaryImageError,
        handleChangeUploadFile: handleChangeUploadFile(AuctionUploadType.PRIMARY),
        handleRemoveUploadFile: handleRemoveUploadFile(AuctionUploadType.PRIMARY),
      },
      goodsImage: {
        fileInfos: goodsImageUploader.fileInfos,
        error: goodsFileIdsError,
        handleChangeUploadFile: handleChangeUploadFile(AuctionUploadType.GOODS),
        handleRemoveUploadFile: handleRemoveUploadFile(AuctionUploadType.GOODS),
        handleChangeVideoPlayType,
      },
      keyword: {
        values: keywords,
        handleUpdateKeywords,
      },
      addedAuctionGoodsItems,
      ticketGoodsInfo,
      handleClickModifyItem,
      handleClickDeleteItem,
      handleClickChangeOrdering,
      handleOpen,
      handleClose,
      handleSubmit: onSubmit,
    },
  };
};
