import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@hooks/useQuery';
import { getLiveList } from '../apis';
import { LiveSearchFieldModel, toLiveQueryParams, LiveListQueryState } from '../models';
import { LIVE_SEARCH_FIELD, QUERY_KEY } from '../constants';

const defaultFormValues: LiveSearchFieldModel = {
  contentsType: null,
  keyword: '',
  keywordIds: [],
  liveStartDate: null,
  liveEndDate: null,
  openStatuses: '',
  liveStatuses: [],
  searchField: LIVE_SEARCH_FIELD.TITLE,
  showRoomIds: [],
};

/**
 * 라이브 리스트 조회
 */
export const useLiveListService = () => {
  const [queryState, setQueryState] = useState<LiveListQueryState>({ ...defaultFormValues, page: '1', size: '10' });
  const formMethod = useForm({
    defaultValues: defaultFormValues,
  });
  const { reset, handleSubmit } = formMethod;

  const { data, isLoading } = useQuery(
    [QUERY_KEY.LIVE_LIST, toLiveQueryParams(queryState)],
    () => getLiveList(toLiveQueryParams(queryState)),
    {
      select: (data) => {
        return {
          ...data,
          content: data.content,
        };
      },
    },
  );

  /**
   * 페이지 번호 및 페이지수 변경시
   */
  const handleChangePagination = (page: number, limit: number) => {
    const prevLimit = +queryState.size;
    let targetPage = page;
    if (limit !== prevLimit) {
      targetPage = 1;
    }
    setQueryState((prevState) => ({
      ...prevState,
      page: targetPage.toString(),
      size: limit.toString(),
    }));
  };

  /**
   * 검색 필터 초기화
   */
  const handleReset = useCallback(() => {
    const resetData = {
      ...queryState,
      ...defaultFormValues,
      page: '1',
    };
    reset(resetData);
  }, [queryState, reset]);

  /**
   * 검색 submit
   */
  const onSubmit = useCallback(
    (data) => {
      const { showRoomIds } = data;
      const newState = {
        ...queryState,
        ...data,
        showRoomIds: showRoomIds.map((showroom) => showroom['value']),
        page: '1',
      };

      setQueryState(newState);
    },
    [queryState],
  );

  const handleSearch = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  return {
    formMethod,
    liveList: data?.content ?? [],
    isLoading,
    pagination: {
      limit: Number(queryState.size) || 10,
      page: Number(queryState.page) || 1,
      total: data?.totalElements || 0,
      onChange: handleChangePagination,
    },
    handleSearch,
    handleReset,
  };
};
