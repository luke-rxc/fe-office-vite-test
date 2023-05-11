import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { DialogType } from '@models/DialogModel';
import { toDateFormat } from '@utils/date';
import { excelExport } from '@utils/excel';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { getShowtimeLiveChannel } from '../apis';
import {
  LiveStatus,
  RaffleEventWinnerExcelCode,
  RehearsalStatus,
  showtimeLiveChannelQueryKey,
  ShowtimeRaffleEventQueryKeys,
} from '../constants';
import {
  useShowtimeRaffleEventDetailQuery,
  useShowtimeRaffleEventItemDrawMutation,
  useShowtimeRaffleEventItemNotifyDrawMutation,
  useShowtimeRaffleEventListQuery,
} from '../hooks';
import {
  toOrderExportTicketExcelItemList,
  toShowtimeLiveChannelModel,
  toShowtimeRaffleEventDetailItemModel,
} from '../models';

interface Props {
  showTimeId: number;
}

export type ReturnTypeUseShowtimeManageRaffleEventService = ReturnType<typeof useShowtimeManageRaffleEventService>;

/**
 * 라이브(쇼타임) 래플 이벤트 service
 */
export const useShowtimeManageRaffleEventService = ({ showTimeId }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  // 선택 id list
  const [selectedIdList, setSelectedIdList] = useState<Array<number>>([]);

  const { data: showtimeRaffleEventDetail, isLoading: isLoadingShowtimeRaffleEventDetail } =
    useShowtimeRaffleEventListQuery(showTimeId, { refetchOnWindowFocus: true });

  const { data: showtimeRaffleEventSelectedItem, isLoading: isLoadingShowtimeRaffleEventSelectedItem } =
    useShowtimeRaffleEventDetailQuery(showTimeId, selectedIdList[0], {
      enabled: selectedIdList.length > 0,
      cacheTime: 0,
      refetchOnWindowFocus: true,
    });

  const { data: showtimeLiveChannelItem, isLoading: isLoadingShowtimeLiveChannelItem } = useQuery(
    [showtimeLiveChannelQueryKey, showTimeId, selectedIdList],
    () => getShowtimeLiveChannel(showTimeId),
    {
      select: (data) => {
        return toShowtimeLiveChannelModel(data);
      },
      cacheTime: 0,
      refetchOnWindowFocus: true,
    },
  );

  const { mutateAsync: requestShowtimeRaffleEventItemDraw, isLoading: isLoadingRequestShowtimeRaffleEventItemDraw } =
    useShowtimeRaffleEventItemDrawMutation({
      onSuccess: (data) => {
        const raffleEventSelectedItem = toShowtimeRaffleEventDetailItemModel(data);
        queryClient.setQueryData(
          ShowtimeRaffleEventQueryKeys.detail(showTimeId, raffleEventSelectedItem.id),
          raffleEventSelectedItem,
        );

        dialog.open({
          type: DialogType.ALERT,
          content:
            raffleEventSelectedItem.winnerList.length > 0
              ? '당첨자 결과 추출이 완료되었습니다'
              : '추첨 대상자가 존재하지 않습니다',
        });
        return queryClient.invalidateQueries(ShowtimeRaffleEventQueryKeys.list(showTimeId));
      },
      onError: (error) => {
        dialog.open({
          type: DialogType.ALERT,
          content: `당첨자 결과 추출중 문제가 발생하였습니다\r\n(${error.data.message})`,
        });
      },
    });

  const {
    mutateAsync: requestShowtimeRaffleEventItemNotifyDraw,
    isLoading: isLoadingRequestShowtimeRaffleEventItemNotifyDraw,
  } = useShowtimeRaffleEventItemNotifyDrawMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries(ShowtimeRaffleEventQueryKeys.detail(showTimeId, data.id));
      queryClient.invalidateQueries(ShowtimeRaffleEventQueryKeys.list(showTimeId));

      dialog.open({
        type: DialogType.ALERT,
        content: '당첨자 발표가 시작되었습니다',
      });
    },
    onError: (error) => {
      dialog.open({
        type: DialogType.ALERT,
        content: `당첨자 발표가 시작중 문제가 발생하였습니다\r\n(${error.data.message})`,
      });
    },
  });

  useEffect(() => {
    if (
      isLoadingShowtimeRaffleEventDetail ||
      isLoadingRequestShowtimeRaffleEventItemDraw ||
      isLoadingRequestShowtimeRaffleEventItemNotifyDraw ||
      isLoadingShowtimeLiveChannelItem
    ) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadingShowtimeRaffleEventDetail,
    isLoadingRequestShowtimeRaffleEventItemDraw,
    isLoadingRequestShowtimeRaffleEventItemNotifyDraw,
    isLoadingShowtimeLiveChannelItem,
  ]);

  /**
   * 선택 id list 업데이트
   */
  const handleUpdateSelectedIdList = (items: Array<number>) => {
    setSelectedIdList(items);
  };

  /**
   * 엑셀 다운로드 (당첨자)
   */
  const handleDownloadExcel = () => {
    showLoading();

    const { id } = showtimeRaffleEventDetail;
    const { drawDate, winnerList, sortNum } = showtimeRaffleEventSelectedItem;
    const excelKeys = Object.keys(RaffleEventWinnerExcelCode);

    const headers = excelKeys.map((key) => {
      return RaffleEventWinnerExcelCode[key] as string;
    });

    hideLoading();

    excelExport({
      headers: [headers],
      sheetData: toOrderExportTicketExcelItemList(winnerList),
      autoFit: true,
      autoFitRatio: 1.5,
      columnMinSize: 10,
      fileName: `${toDateFormat(drawDate, 'yyyyMMdd')}_eventid_${id}_no_${sortNum}.xlsx`,
    });
  };

  /**
   * 당첨자 결과 추출
   */
  const handleClickRaffleEventItemDraw = async () => {
    await requestShowtimeRaffleEventItemDraw({
      liveId: showTimeId,
      raffleId: showtimeRaffleEventSelectedItem.id,
    });
  };

  /**
   * 당첨자 발표 시작 처리
   */
  const handleClickRaffleEventItemNotifyDraw = () => {
    dialog.open({
      type: DialogType.CONFIRM,
      title: '확인',
      content: '당첨자 발표를 시작하시겠습니까?',
      onConfirm: async () => {
        await requestShowtimeRaffleEventItemNotifyDraw({
          liveId: showTimeId,
          raffleId: showtimeRaffleEventSelectedItem.id,
        });
      },
    });
  };

  return {
    raffleEventInfo: {
      item: showtimeRaffleEventDetail,
      isLoading: isLoadingShowtimeRaffleEventDetail,
      selectedIds: selectedIdList,
      onUpdateSelectedIds: handleUpdateSelectedIdList,
    },
    raffleEventDetailInfo: {
      item: showtimeRaffleEventSelectedItem,
      isLoading: isLoadingShowtimeRaffleEventSelectedItem,
      extracting: isLoadingRequestShowtimeRaffleEventItemDraw,
      enabledAction:
        showtimeLiveChannelItem?.liveStatus === LiveStatus.LIVE ||
        showtimeLiveChannelItem?.rehearsalStatus === RehearsalStatus.REHEARSAL,
      onDownloadExcel: handleDownloadExcel,
      onClickRaffleEventItemDraw: handleClickRaffleEventItemDraw,
      onClickRaffleEventItemNotifyDraw: handleClickRaffleEventItemNotifyDraw,
    },
  };
};
