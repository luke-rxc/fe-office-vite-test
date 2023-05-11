import { useForm } from 'react-hook-form';
import {
  limitSearchShowroomCount,
  liveStatusOptions,
  openStatusOptions,
  SearchField,
  SearchFilterMore,
  showtimeContentsListQueryKey,
} from '../constants';
import { ShowtimeContentsListQueryState, ShowtimeListFormField } from '../types';
import { addDays, isDate } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  KeywordComboItemModel,
  ShowroomComboItemModel,
  ShowtimeContentsModel,
  toFormField,
  toQueryParams,
  toQueryState,
  toShowtimeContentsModelList,
} from '../models';
import { useQuery } from '@hooks/useQuery';
import { createShowtimeChatChannel, getShowtimeContents } from '../apis';
import { TableColumnProps } from '@components/table/Table';
import { Button, Link } from '@material-ui/core';
import { useQueryState } from '@hooks/useQueryState';
import { ContentImage } from '../components';
import { pathConfig } from '@config';
import { useNavigate } from 'react-router';
import { useMutation } from '@hooks/useMutation';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';

interface Props {
  showroomComboList: Array<ShowroomComboItemModel>;
  keywordComboList: Array<KeywordComboItemModel>;
}

export const useShowtimeContentsListService = ({ showroomComboList, keywordComboList }: Props) => {
  const navigate = useNavigate();
  const { open: dialogOpen } = useDialog();
  /**
   * 필터 더보기
   */
  const [filterMore, setFilterMore] = useState<SearchFilterMore>(SearchFilterMore.ALL);

  const { queryState, updateQueryState } = useQueryState<ShowtimeContentsListQueryState>({
    page: '1',
    size: '10',
  });

  const defaultFormValues: ShowtimeListFormField = {
    keyword: '',
    searchField: SearchField.TITLE,
    showRoomIds: [],
    liveStartDate: null,
    liveEndDate: null,
    contentsType: '',
    openStatuses: openStatusOptions.map(() => false),
    liveStatuses: liveStatusOptions.map(() => false),
  };

  const formMethod = useForm<ShowtimeListFormField>({
    defaultValues: toFormField(queryState, defaultFormValues, showroomComboList, keywordComboList),
    reValidateMode: 'onChange',
  });
  const { reset, formState, handleSubmit, setError, setValue, watch } = formMethod;

  const { data: showtimeContentsResponse, isLoading: showtimeContentListLoading } = useQuery(
    [showtimeContentsListQueryKey, toQueryParams(queryState)],
    () => getShowtimeContents(toQueryParams(queryState)),
    {
      select: (data) => {
        return {
          ...data,
          content: toShowtimeContentsModelList(data.content),
        };
      },
      enabled: formState.isValid,
      cacheTime: 10 * 1000,
    },
  );

  const [showRoomIds] = watch(['showRoomIds']);

  const { mutateAsync: createChatChannel, isError: isErrorCreateChatChannel } = useMutation((showTimeId: number) =>
    createShowtimeChatChannel(showTimeId),
  );

  useEffect(() => {
    reset(toFormField(queryState, defaultFormValues, showroomComboList, keywordComboList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState, showroomComboList, keywordComboList]);

  useEffect(() => {
    if (isErrorCreateChatChannel) {
      dialogOpen({
        type: DialogType.ALERT,
        content: '문제가 발생하여 이동할 수 없습니다.\r\n다시 확인해주세요.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorCreateChatChannel]);

  const getDateValues = (dateValue: number | string) => {
    return Number.isInteger(dateValue) ? dateValue : isDate(dateValue) ? new Date(dateValue).getTime() : undefined;
  };

  /**
   * 검색 submit
   */
  const onSubmit = handleSubmit((values) => {
    const startDate = getDateValues(values.liveStartDate);
    const endDate = getDateValues(values.liveEndDate);

    const oneDay = 1000 * 60 * 60 * 24;
    const difference_ms = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    const diffValue = Math.round(difference_ms / oneDay);

    if (diffValue > 30) {
      setError('liveStartDate', {
        type: 'manual',
        message: '방송일 검색일 간격은 한달 이내여야 합니다.',
      });
      return;
    }

    const syncQueryState = toQueryState(
      {
        ...values,
        liveStartDate: startDate,
        liveEndDate: endDate,
      },
      queryState,
    );

    updateQueryState({
      ...syncQueryState,
      page: '1',
    });
  });

  /**
   * 검색 필터 초기화
   */
  const handleReset = () => {
    reset(defaultFormValues);
    updateQueryState(toQueryState(defaultFormValues, queryState));
  };

  /**
   * 검색필터 더보기 toggle
   */
  const handleClickShowMore = () => {
    setFilterMore((prev) => (prev === SearchFilterMore.ALL ? SearchFilterMore.REQUIRED : SearchFilterMore.ALL));
  };

  /**
   * 방송일 날짜 필터 범위 변경
   */
  const handleChangeLiveRange = (range: number) => {
    const fromDate = Number.isInteger(range) ? new Date().getTime() : null;
    const toDate = Number.isInteger(range) ? addDays(new Date(), range).getTime() : null;

    setValue('liveStartDate', fromDate);
    setValue('liveEndDate', toDate);
  };

  /**
   * 페이지 번호 및 페이지수 변경시
   */
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: limit.toString(),
    });
  };

  const handleClickGoCreateStandard = () => {
    navigate('/showtime/contents/standard/create');
  };

  const handleClickGoCreateAuction = () => {
    navigate('/showtime/contents/auction/create');
  };

  const onClickOpenDashboard = (item: ShowtimeContentsModel) => {
    return async () => {
      await createChatChannel(item.id);
      window.open(`/showtime/manage/dashboard/${item.id}`, '_blank');
    };
  };

  const showtimeContentsColumns: Array<TableColumnProps<ShowtimeContentsModel>> = [
    {
      label: '라이브 ID',
      dataKey: 'id',
      align: 'center',
      width: '80px',
    },
    {
      label: '콘텐츠 타입',
      dataKey: 'contentsTypeText',
      align: 'center',
      width: '100px',
    },
    {
      label: '콘텐츠 제목',
      dataKey: 'title',
      render: (value, item) => {
        return <Link href={`/showtime/contents/${item.id}`}>{value}</Link>;
      },
    },
    {
      label: '쇼룸',
      dataKey: 'showRoomName',
      align: 'center',
    },
    {
      label: '상품 정보',
      dataKey: 'goodsName',
      render: (value, item) => {
        return (
          <>
            <div>{value}</div>
            {item.goodsCountText ? <div>{item.goodsCountText}</div> : null}
          </>
        );
      },
    },
    {
      label: '대표이미지',
      dataKey: 'primaryImage.path',
      align: 'center',
      render: (value, item) => {
        return <ContentImage path={`${pathConfig.cdnUrl}/${value}`} />;
      },
    },
    {
      label: '라이브 시작일시',
      dataKey: 'liveStartDateText',
      align: 'center',
      width: '130px',
    },
    {
      label: 'Live 상태',
      dataKey: 'liveStatusText',
      align: 'center',
    },
    {
      label: '공개 상태',
      dataKey: 'openStatusText',
      align: 'center',
    },
    {
      label: '비고',
      dataKey: 'action',
      render: (value, item) => {
        return (
          <Button variant="contained" color="primary" size="small" onClick={onClickOpenDashboard(item)}>
            라이브 운영 대시보드
          </Button>
        );
      },
    },
  ];

  return {
    form: {
      formMethod,
      handleSubmit: onSubmit,
      handleReset,
      limit: {
        showRoomIds: showRoomIds.length >= limitSearchShowroomCount,
      },
    },
    filterMore,
    showtimeContentsColumns,
    showtimeContentsList: showtimeContentsResponse?.content ?? [],
    showtimeContentListLoading,
    pagination: {
      limit: Number(queryState.size) || 10,
      page: Number(queryState.page) || 1,
      total: showtimeContentsResponse?.totalElements || 0,
      onChange: handleChangePagination,
    },
    handleClickGoCreateStandard,
    handleClickGoCreateAuction,
    handleClickShowMore,
    handleChangeLiveRange,
  };
};
