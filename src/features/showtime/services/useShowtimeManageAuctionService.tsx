import { TableColumnProps } from '@components/table/Table';
import { useDialog } from '@hooks/useDialog';
import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { Box, Button } from '@material-ui/core';
import { DialogType } from '@models/DialogModel';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import {
  getShowtimeAuctionBid,
  getShowtimeAuctionItems,
  updateShowtimeAuctionItem,
  updateShowtimeAuctionItemUnitPrice,
} from '../apis';
import { AuctionGoodsContents, StatusCircleStyled } from '../components';
import {
  AuctionRequestStatus,
  AuctionRequestStatusCompleteMessage,
  AuctionRequestStatusLabel,
  AuctionRequestStatusMessage,
  AuctionStatus,
  SendbirdActionType,
  showtimeAuctionItemsQueryKey,
} from '../constants';
import { useAuctionChat, useElementSize, useSendbird, useShowtimeModal } from '../hooks';
import {
  SendBirdAdminMessageModel,
  ShowtimeAuctionBidModel,
  ShowtimeChatChannelModel,
  ShowtimeManageItemAuctionGoodsModel,
  toShowtimeAuctionBidModel,
  toShowtimeManageItemAuctionGoodsModel,
  toShowtimeManageItemAuctionGoodsModelList,
} from '../models';
import { ShowtimeManageItemAuctionGoodsSchema } from '../schemas';
import { ShowtimeChangeUnitPriceParams, ShowtimeUnitPriceFormField } from '../types';
import { toCamelCase } from '../utils';
import { VariableSizeList as List } from 'react-window';

const getActionInfo = (status: AuctionStatus): Array<[AuctionRequestStatus, boolean]> => {
  switch (status) {
    case AuctionStatus.BLOCKED_WAITING:
      return [
        [AuctionRequestStatus.OPENING, true],
        [AuctionRequestStatus.COUNTDOWN, true],
        [AuctionRequestStatus.START_BIDDING, true],
        [AuctionRequestStatus.SUCCESSFUL_BID, true],
      ];
    case AuctionStatus.WAITING:
      return [
        [AuctionRequestStatus.OPENING, false],
        [AuctionRequestStatus.COUNTDOWN, true],
        [AuctionRequestStatus.START_BIDDING, true],
        [AuctionRequestStatus.SUCCESSFUL_BID, true],
      ];
    case AuctionStatus.OPENING:
      return [
        [AuctionRequestStatus.CANCEL_AUCTION, true],
        [AuctionRequestStatus.COUNTDOWN, true],
        [AuctionRequestStatus.START_BIDDING, false],
        [AuctionRequestStatus.SUCCESSFUL_BID, true],
      ];
    case AuctionStatus.BIDDING:
      return [
        [AuctionRequestStatus.CANCEL_AUCTION, true],
        [AuctionRequestStatus.COUNTDOWN, false],
        [AuctionRequestStatus.PAUSE_BIDDING, false],
        [AuctionRequestStatus.SUCCESSFUL_BID, false],
      ];
    case AuctionStatus.COUNTDOWN:
      return [
        [AuctionRequestStatus.CANCEL_AUCTION, true],
        [AuctionRequestStatus.COUNTDOWN, true],
        [AuctionRequestStatus.PAUSE_BIDDING, true],
        [AuctionRequestStatus.SUCCESSFUL_BID, true],
      ];
    case AuctionStatus.PAUSE:
      return [
        [AuctionRequestStatus.CANCEL_AUCTION, false],
        [AuctionRequestStatus.COUNTDOWN, true],
        [AuctionRequestStatus.RESUME_BIDDING, false],
        [AuctionRequestStatus.SUCCESSFUL_BID, false],
      ];
    case AuctionStatus.SUCCESSFUL_BID:
    case AuctionStatus.CANCEL:
      return [
        [AuctionRequestStatus.CANCEL_AUCTION, true],
        [AuctionRequestStatus.COUNTDOWN, true],
        [AuctionRequestStatus.PAUSE_BIDDING, true],
        [AuctionRequestStatus.SUCCESSFUL_BID, true],
      ];
  }
};

export type ReturnTypeUseShowtimeManageAuctionService = ReturnType<typeof useShowtimeManageAuctionService>;

export const useShowtimeManageAuctionService = (showTimeId: number, chatChannelItem: ShowtimeChatChannelModel) => {
  const [selectedAuctionItem, setSelectedAuctionItem] = useState<ShowtimeManageItemAuctionGoodsModel>();
  const [auctionBidItem, setAuctionBidItem] = useState<ShowtimeAuctionBidModel | undefined>();
  const { open: dialogOpen, close: dialogClose } = useDialog();

  const messagesRef = useRef<{ currentIndex: number; total: number }>({ currentIndex: 0, total: 0 });
  /** message area ref */
  const messageAreaRef = useRef<HTMLDivElement>(null);
  /** message list ref */
  const messagesScrollRef = useRef<List<SendBirdAdminMessageModel[]>>(null);
  /** message item size map array */
  const sizeMap = useRef<Array<number>>([]);

  /* 최신 메세지 보기 표시여부  */
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false);
  const [messageAreaWidth] = useElementSize(messageAreaRef);

  const {
    showModal: showBidModal,
    handleOpenModal: handleOpenBidModal,
    handleCloseModal: handleCloseBidModal,
  } = useShowtimeModal();
  const queryClient = useQueryClient();
  const timer = useRef(null);

  const updateItems = async () => {
    timer.current && clearTimeout(timer.current);
    await queryClient.refetchQueries([showtimeAuctionItemsQueryKey, showTimeId]);

    const refetchItems = queryClient.getQueryData([
      showtimeAuctionItemsQueryKey,
      showTimeId,
    ]) as Array<ShowtimeManageItemAuctionGoodsSchema>;

    selectedAuctionItem &&
      setSelectedAuctionItem(
        toShowtimeManageItemAuctionGoodsModel(refetchItems.find((item) => item.id === selectedAuctionItem.id)),
      );
  };

  /**
   * 메세지창 스크롤 최하단 여부 확인
   */
  const isMessageScrollBottom = (messageLength?: number) => {
    if (messagesRef?.current) {
      return messagesRef.current.currentIndex === (messageLength ?? messagesRef.current.total);
    }

    return false;
  };

  /**
   * 메세지창 스크롤 최하단 이동
   */
  const toMessageScrollBottom = (messageLength?: number) => {
    if (messagesScrollRef?.current) {
      messagesScrollRef.current.scrollToItem(messageLength ?? messagesRef.current.total);
    }
  };

  const handleUpdateShowScrollBottom = (isShow: boolean) => {
    setShowScrollBottom(isShow);
  };

  const { countdown, remainingTime, resetCountdown, handleMessageReceived, handleMetaDataUpdated } = useAuctionChat(
    chatChannelItem,
    updateItems,
  );

  const { auctionMessages, loadMorePreviousAuctionMessage, loadPreviousAuctionMessageByCustomType } = useSendbird({
    useChannel: {
      auction: true,
    },
    chatChannelItem,
    isMessageScrollBottom,
    toMessageScrollBottom,
    handleUpdateShowScrollBottom,
    handleMessageReceived,
    handleMetaDataUpdated,
  });

  const handleUpdateMessageScrollRef = async (currentIndex: number, total: number) => {
    messagesRef.current.currentIndex = currentIndex;
    messagesRef.current.total = total;

    if (currentIndex === total) {
      setShowScrollBottom((prev) => {
        if (prev) {
          return false;
        }

        return prev;
      });
    }
  };

  const formMethod = useForm<ShowtimeUnitPriceFormField>({
    defaultValues: { unitPrice: '', maximumBidPrice: '', usedMaximumBidPrice: false },
  });
  const { handleSubmit, reset } = formMethod;

  const { data: auctionItems, isLoading: isLoadingAuctionItems } = useQuery(
    [showtimeAuctionItemsQueryKey, showTimeId],
    () => getShowtimeAuctionItems(showTimeId),
    {
      select: toShowtimeManageItemAuctionGoodsModelList,
    },
  );

  /**
   * 입찰 내역 target id
   * 선택상품이 있으면 - 선택상품의 입찰내역
   * 선택상품이 없으면 - 경매 진행중인 입찰내역
   */
  const bidReportTargetId = useMemo(() => {
    if (selectedAuctionItem !== undefined) {
      return selectedAuctionItem.id;
    }

    if (!auctionItems) {
      return null;
    }
    const biddingItem = auctionItems.find(
      (item) =>
        item.status !== AuctionStatus.BLOCKED_WAITING &&
        item.status !== AuctionStatus.WAITING &&
        item.status !== AuctionStatus.SUCCESSFUL_BID &&
        item.status !== AuctionStatus.CANCEL,
    );
    return biddingItem ? biddingItem.id : null;
  }, [auctionItems, selectedAuctionItem]);

  const [filteredAuctionMessages, lastAuctionMessage] = useMemo(() => {
    if (auctionMessages.length === 0 || !bidReportTargetId) {
      return [[], undefined];
    }

    const filteredMessages = auctionMessages.filter((message) => {
      return message.customType === String(bidReportTargetId);
    });

    const lastAuctionMessage = filteredMessages
      .filter((message) => {
        return message.data.actionType === SendbirdActionType.MESSAGE;
      })
      .pop();

    return [filteredMessages, lastAuctionMessage];
  }, [auctionMessages, bidReportTargetId]);

  const { mutateAsync: updateAuctionItemUnitPrice } = useMutation(
    (params: ShowtimeChangeUnitPriceParams) =>
      updateShowtimeAuctionItemUnitPrice(showTimeId, selectedAuctionItem.id, params),
    {
      onError: (error) => {
        dialogOpen({
          title: '에러',
          content: `${
            AuctionRequestStatusLabel[AuctionRequestStatus.CHANGE_UNIT_PRICE]
          } 요청에 문제가 발생하였습니다.\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const { mutateAsync: updateAuctionItem } = useMutation(
    (requestStatus: AuctionRequestStatus) =>
      updateShowtimeAuctionItem(showTimeId, selectedAuctionItem.id, requestStatus),
    {
      onError: async (error, requestStatus) => {
        updateItems();

        dialogOpen({
          title: '에러',
          content: `${AuctionRequestStatusLabel[requestStatus]} 변경요청에 문제가 발생하였습니다.\r\n(${error.data.message})`,
          type: DialogType.ALERT,
        });
      },
    },
  );

  const { mutateAsync: getAuctionBid } = useMutation(
    (auctionId: number) => getShowtimeAuctionBid(showTimeId, auctionId),
    {
      onError: (error) => {
        dialogOpen({
          content: `낙찰자 정보 조회에 문제가 발생하였습니다.`,
        });
      },
    },
  );

  useEffect(() => {
    if (selectedAuctionItem) {
      reset({
        unitPrice: selectedAuctionItem.bidUnitPrice.toString(),
        maximumBidPrice: selectedAuctionItem.maximumBidPrice.toString(),
        usedMaximumBidPrice: selectedAuctionItem.maximumBidPrice > 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuctionItem]);

  useEffect(() => {
    if (bidReportTargetId) {
      loadPreviousAuctionMessageByCustomType([String(bidReportTargetId)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidReportTargetId]);

  useEffect(() => {
    if (countdown > 0) {
      timer.current = setTimeout(async () => {
        countdown > 0 && resetCountdown();
        timer.current = null;
      }, 11000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const selectedIds = useMemo(() => {
    if (!selectedAuctionItem) {
      return [];
    }

    return [selectedAuctionItem.id];
  }, [selectedAuctionItem]);

  /**
   * action information
   */
  const actionInfo = useMemo(() => {
    return selectedAuctionItem ? getActionInfo(selectedAuctionItem.status) : null;
  }, [selectedAuctionItem]);

  /**
   * 폼 초기화
   */
  const clearForm = () => {
    reset({
      unitPrice: '',
    });
  };

  /**
   * 경매상품 선택 업데이트
   */
  const handleUpdateSelectedIds = (items: Array<number>) => {
    setSelectedAuctionItem(auctionItems.find((item) => item.id === items[0]));

    if (items.length === 0) {
      clearForm();
    }
  };

  const showLoading = () => {
    dialogOpen({
      content: '진행중입니다. 잠시만 기다려주세요.',
      type: DialogType.ALERT,
    });
  };

  /**
   * 경매상품 상태 변경
   */
  const handleUpdateAuctionStatus = (requestStatus: AuctionRequestStatus) => {
    dialogOpen({
      title: AuctionRequestStatusLabel[requestStatus],
      content: AuctionRequestStatusMessage[requestStatus],
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        showLoading();
        const updatedItem = await updateAuctionItem(requestStatus).then(toShowtimeManageItemAuctionGoodsModel);

        queryClient.refetchQueries([showtimeAuctionItemsQueryKey, showTimeId]);
        setSelectedAuctionItem(updatedItem);

        updateItems();

        dialogOpen({
          title: '알림',
          content: `${AuctionRequestStatusCompleteMessage[requestStatus]}`,
          type: DialogType.ALERT,
        });
      },
      onClose: dialogClose,
    });
  };

  /**
   * 입찰 단위 금액 변경
   */
  const onSubmit = handleSubmit(({ unitPrice, usedMaximumBidPrice, maximumBidPrice }) => {
    dialogOpen({
      title: AuctionRequestStatusLabel[AuctionRequestStatus.CHANGE_UNIT_PRICE],
      content: AuctionRequestStatusMessage[AuctionRequestStatus.CHANGE_UNIT_PRICE],
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        showLoading();
        await updateAuctionItemUnitPrice({
          unitPrice: Number(unitPrice),
          maximumBidPrice: usedMaximumBidPrice ? Number(maximumBidPrice) : 0,
        });

        dialogOpen({
          title: '알림',
          content: `${AuctionRequestStatusCompleteMessage[AuctionRequestStatus.CHANGE_UNIT_PRICE]}`,
          type: DialogType.ALERT,
        });
      },
      onClose: dialogClose,
    });
  });

  /**
   * 상품 정보 수정 새창 열기
   */
  const onClickOpenAuctionGoods = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    window.open(`/showtime/contents/${showTimeId}`, '_blank');
  };

  /**
   * 상품 상세보기
   */
  const onClickShowAuctionGoods = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toast.error('준비중!!');
  };

  /**
   * 낙찰정보 보기
   */
  const onClickShowBidComplete = (auctionId: number) => {
    return async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      const bidItem = await getAuctionBid(auctionId);
      if (bidItem) {
        setAuctionBidItem(toShowtimeAuctionBidModel(bidItem));
        handleOpenBidModal();
      }
    };
  };

  const onCloseBidModal = () => {
    setAuctionBidItem(undefined);
    handleCloseBidModal();
  };

  const columns: Array<TableColumnProps<ShowtimeManageItemAuctionGoodsModel>> = [
    {
      label: '경매상품',
      dataKey: 'id',
      align: 'center',
      width: '100px',
    },
    {
      label: '상품정보',
      dataKey: 'name',
      render: (value, item) => {
        return <AuctionGoodsContents item={item} />;
      },
    },
    {
      label: '경매상태',
      dataKey: 'statusText',
      align: 'center',
      width: '90px',
      render: (value, item) => {
        return (
          <>
            <StatusCircleStyled className={toCamelCase(item.status)} />
            <Box>{value}</Box>
          </>
        );
      },
    },
    {
      label: '추가작업',
      dataKey: 'actions',
      align: 'center',
      width: '140px',
      render: (value, item, index) => {
        if (item.status === AuctionStatus.SUCCESSFUL_BID) {
          return (
            <Button variant="contained" size="small" sx={{ width: '100%' }} onClick={onClickShowBidComplete(item.id)}>
              낙찰정보
            </Button>
          );
        }

        return (
          <>
            <Button variant="contained" size="small" sx={{ width: '100%' }} onClick={onClickOpenAuctionGoods}>
              상품 정보 수정
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ width: '100%', mt: '10px' }}
              onClick={onClickShowAuctionGoods}
            >
              상품 상세 보기
            </Button>
          </>
        );
      },
    },
  ];

  /**
   * 이전 메세지 불러오기
   */
  const handleLoadMorePreviousMessage = async () => {
    const result = await loadMorePreviousAuctionMessage([String(bidReportTargetId)]);
    if (result) {
      messagesScrollRef.current.scrollToItem(35);
    }
  };

  /**
   * message item 높이 설정
   */
  const setMessageHeight = useCallback((index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      messagesScrollRef.current?.resetAfterIndex(index);
    }
  }, []);

  /**
   * message item 높이 조회
   */
  const getMessageHeight = (index: number) => {
    return sizeMap.current[index] + 10 || 46;
  };

  return {
    form: {
      formMethod,
      handleSubmitUnitPrice: onSubmit,
    },
    selectedIds,
    columns,
    auctionItems,
    lastAuctionMessage,
    isLoadingAuctionItems,
    selectedAuctionItem,
    actionInfo,
    remainingTime,
    showBidModal,
    auctionBidItem,
    bidReportTargetId,
    auctionMessages: filteredAuctionMessages,
    showScrollBottom,
    messageAreaRef,
    messagesScrollRef,
    messageAreaWidth,
    handleLoadMorePreviousMessage,
    handleUpdateMessageScrollRef,
    isMessageScrollBottom,
    toMessageScrollBottom,
    getMessageHeight,
    setMessageHeight,

    handleUpdateSelectedIds,
    handleUpdateAuctionStatus,
    handleCloseBidModal: onCloseBidModal,
  };
};
