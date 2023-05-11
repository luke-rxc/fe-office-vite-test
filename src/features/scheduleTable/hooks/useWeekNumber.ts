import { useMemo, useState } from 'react';
import { WeekNumberByToday } from '../constants';
import { getDifferenceDays, getFirstDateOfWeek, getLastDateOfWeek, getWeekDates, getWeekTitle } from '../utils';

/**
 * 주차 관리 hook
 */
export const useWeekNumber = () => {
  const [weekNumber, setWeekNumber] = useState<number>(WeekNumberByToday);

  const [firstDateTimeOfWeek, lastDateTimeOfWeek, weekDates, weekTitle] = useMemo(() => {
    // 주차(week) 기준 range에 해당하는 주(week)의 처음 date
    const firstDateTimeOfWeek = getFirstDateOfWeek(weekNumber).getTime();
    // 주차(week) 기준 range에 해당하는 주(week)의 마지막 date
    const lastDateTimeOfWeek = getLastDateOfWeek(weekNumber).getTime();
    // 주차(week) 기준 range에 해당하는 주(week)의 date 배열
    const weekDates = getWeekDates(weekNumber);
    // 주차(week) 기준 range에 해당하는 주(week)의 title 정보
    const weekTitle = getWeekTitle(weekNumber);

    // window.console.log('useWeekNumber:', {
    //   weekNumber,
    //   firstDateTimeOfWeek,
    //   lastDateTimeOfWeek,
    //   weekDates,
    //   weekTitle,
    // });

    return [firstDateTimeOfWeek, lastDateTimeOfWeek, weekDates, weekTitle];
  }, [weekNumber]);

  /**
   * 주차 증가
   */
  const handleIncreaseWeekNumber = () => {
    setWeekNumber((prev) => prev + 1);
  };

  /**
   * 주차 감소
   */
  const handleDecreaseWeekNumber = () => {
    setWeekNumber((prev) => prev - 1);
  };

  /**
   * 주차 초기화
   */
  const handleResetWeekNumber = () => {
    setWeekNumber(0);
  };

  /**
   * 주차 변경
   */
  const handleChangeWeekNumber = (date: Date) => {
    const differenceDays = getDifferenceDays(date);
    const weekDay = Math.floor(differenceDays / 7);
    setWeekNumber(weekDay);
  };

  return {
    weekNumber,
    firstDateTimeOfWeek,
    lastDateTimeOfWeek,
    weekDates,
    weekTitle,
    actions: {
      handleIncreaseWeekNumber,
      handleDecreaseWeekNumber,
      handleResetWeekNumber,
      handleChangeWeekNumber,
    },
  };
};
