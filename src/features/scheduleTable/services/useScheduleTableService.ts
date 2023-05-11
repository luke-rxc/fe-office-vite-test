import { useDialog } from '@hooks/useDialog';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { DialogType } from '@models/DialogModel';
import { ErrorModel } from '@utils/api/createAxios';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { getScheduleItems } from '../apis';
import { scheduleTableQueryKey } from '../constants';
import { useWeekNumber } from '../hooks';
import { toScheduleTableWeekDaysModel } from '../models';

export type ReturnTypeUseScheduleTableService = ReturnType<typeof useScheduleTableService>;

/**
 * 편성표 service
 */
export const useScheduleTableService = () => {
  const { showLoading, hideLoading } = useLoading();
  const dialog = useDialog();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { weekNumber, firstDateTimeOfWeek, lastDateTimeOfWeek, weekDates, weekTitle, actions } = useWeekNumber();
  const queryClient = useQueryClient();

  /**
   * 에러 처리
   */
  const onError = (targetName: string) => {
    return (error: ErrorModel) => {
      dialog.open({
        type: DialogType.ALERT,
        content: `${targetName} 문제가 발생하였습니다\r\n(${error.data.message})`,
        onClose: () => {
          dialog.close();
        },
      });
    };
  };

  const { data: scheduleItems, isLoading: isLoadingScheduleItems } = useQuery(
    [scheduleTableQueryKey, firstDateTimeOfWeek, lastDateTimeOfWeek],
    () =>
      getScheduleItems({
        startDate: firstDateTimeOfWeek,
        endDate: lastDateTimeOfWeek,
      }),
    {
      select: (data) => toScheduleTableWeekDaysModel(data, weekDates),
      onError: onError('편성표 조회중'),
    },
  );

  useEffect(() => {
    if (isLoadingScheduleItems) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingScheduleItems]);

  /**
   * 현재 편성표 갱신
   */
  const handleReloadCurrentScheduleTable = () => {
    queryClient.invalidateQueries([scheduleTableQueryKey, firstDateTimeOfWeek, lastDateTimeOfWeek]);
  };

  return {
    scheduleItems,
    weekTitle,
    actions,
    handleReloadCurrentScheduleTable,
  };
};
