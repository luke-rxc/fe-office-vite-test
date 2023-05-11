import { useMemo, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { isDate } from 'date-fns';
import toast from 'react-hot-toast';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import useLoading from '@hooks/useLoading';
import { useQueryState } from '@hooks/useQueryState';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import { QUERY_KEY, CONTENT_TYPE, CONTENT_SEARCH_TYPE, CONTENT_SEARCH_DATE_TYPE } from '../constants';
import { toFormField, toQueryState, toQueryParams, toContentList, ContentSearchFieldModel } from '../models';
import { ContentListQueryState } from '../models';
import { getContentList, postContentDuplicate } from '../apis';
import { useKeywordService } from './useKeywordService';
import { DateRangeModel, useDateRangeService } from './useDateRangeService';

/**
 * form 기본값
 */
const defaultFormValues: ContentSearchFieldModel = {
  // 콘텐츠 검색 타입 - 콘텐츠명/쇼룸명/입점사
  searchType: CONTENT_SEARCH_TYPE.STORY_NAME,
  // 콘텐츠 검색어
  searchValue: '',
  // 기간조회 타입 - 전체 기간 / 최초 생성일 / 최종 편집일 / 공개 기간
  searchDateType: CONTENT_SEARCH_DATE_TYPE.ALL,
  // 기간 시작일
  searchStartDate: null,
  // 기간 종료일
  searchEndDate: null,
  // 공개 상태
  statusList: '',
  // 컨텐츠 타입
  type: '',
  // 키워드
  keywordIds: [],
};

export const useContentListService = () => {
  const client = useQueryClient();
  const { showLoading, hideLoading } = useLoading();
  const { keywordComboList } = useKeywordService(); // 키워드 리스트
  const { handleGetRangeDate } = useDateRangeService();

  const { queryState, updateQueryState } = useQueryState<ContentListQueryState>({
    page: '1',
    size: '10',
  });

  // query string -> formField
  const formField = useMemo(
    () => toFormField(queryState, defaultFormValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryState],
  );

  const formMethod = useForm<ContentSearchFieldModel>({
    defaultValues: formField,
  });

  const { reset, getValues, handleSubmit, setError, setValue } = formMethod;
  const { data, isLoading } = useQuery(
    [QUERY_KEY.CONTENT_LIST, toQueryParams(queryState)],
    () => getContentList(toQueryParams(queryState)),
    {
      select: (data) => {
        return {
          ...data,
          content: toContentList(data.content),
        };
      },
      cacheTime: 0,
    },
  );
  const { open: openDialog, close: closeDialog } = useDialog();

  /**
   * 초기에 키워드 리스트 업데이트 되고 queryState 기준 키워드 리스트 활성화 처리.
   */
  useEffect(() => {
    if (keywordComboList && keywordComboList.length > 0) {
      if (queryState.keywordIds) {
        const targetKeywordIs = queryState.keywordIds.split(',').map((keyword) => +keyword) ?? [];
        const keywords = keywordComboList.filter((keywordCombo) => {
          const value = keywordCombo.value as number;
          return targetKeywordIs.includes(value);
        });
        setValue('keywordIds', keywords);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordComboList]);

  /**
   * 날짜값 조회
   */
  const getDateValues = (dateValue: number | string) => {
    return Number.isInteger(dateValue) ? dateValue : isDate(dateValue) ? new Date(dateValue).getTime() : undefined;
  };

  /**
   * 날짜 필터 범위 변경
   */
  const handleChangeDateRange = (range: DateRangeModel) => {
    const { fromDate, toDate } = handleGetRangeDate(range);
    setValue('searchStartDate', fromDate);
    setValue('searchEndDate', toDate);
  };

  /**
   * 컨텐츠 타입 변경
   */
  const handleChangeContentType = (type: CONTENT_TYPE | '') => {
    setValue('type', type);
    const syncQueryState = toQueryState(
      {
        ...getValues(),
        type,
      },
      queryState,
    );

    updateQueryState({
      ...syncQueryState,
      page: '1',
    });
  };

  /**
   * 리스트 페이지 번호 및 페이지수 변경시
   */
  const handleChangePagination = (page: number, limit: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: limit.toString(),
    });
  };

  /**
   * 검색 필터 초기화
   */
  const handleReset = () => {
    const resetData: ContentSearchFieldModel = {
      ...defaultFormValues,
      type: queryState?.type ?? '',
    };

    reset(resetData);
    updateQueryState(toQueryState(resetData, queryState));
  };

  const handleAfterCreator = () => {
    const resetData: ContentSearchFieldModel = {
      ...defaultFormValues,
      type: '',
    };
    reset(resetData);
    client.invalidateQueries([QUERY_KEY.CONTENT_LIST, toQueryParams(queryState)]);
    updateQueryState(toQueryState(resetData, { ...queryState, page: '1' }));
  };

  const handleAfterModify = () => {
    client.invalidateQueries([QUERY_KEY.CONTENT_LIST, toQueryParams(queryState)]);
  };

  const handleAfterDuplicate = () => {
    const { type } = queryState;
    const resetData: ContentSearchFieldModel = {
      ...defaultFormValues,
      type,
    };
    reset(resetData);
    client.invalidateQueries([QUERY_KEY.CONTENT_LIST, toQueryParams(queryState)]);
    updateQueryState(toQueryState(resetData, { ...queryState, page: '1' }));
  };

  /**
   * 검색 submit
   */
  const handleFormSubmit = handleSubmit((values) => {
    const { searchStartDate, searchEndDate } = values;
    const startDate = getDateValues(searchStartDate);
    const endDate = getDateValues(searchEndDate);

    if (!!startDate && !!endDate && startDate > endDate) {
      setError('searchStartDate', {
        type: 'manual',
        message: '날짜를 확인해 주세요.',
      });
      setError('searchEndDate', {
        type: 'manual',
        message: '날짜를 확인해 주세요.',
      });
      return;
    }

    const newQueryState = toQueryState(
      {
        ...values,
        searchStartDate: startDate,
        searchEndDate: endDate,
      },
      queryState,
    );

    updateQueryState({
      ...newQueryState,
      page: '1',
    });
  });

  /**
   * 컨텐츠 복제
   */
  const { mutate } = useMutation((id: number) => postContentDuplicate(id), {
    onSuccess: () => {
      hideLoading();

      openDialog({
        title: '콘텐츠 복제 완료',
        content: '콘텐츠를 편집 해 보세요',
        type: DialogType.ALERT,
        onClose: () => {
          closeDialog();
        },
      });
      handleAfterDuplicate();
    },
    onError: (error: ErrorModel<ErrorDataModel>) => {
      const msg = error.data?.message;
      toast.error(msg);
      hideLoading();
    },
  });

  const handleDuplicate = (id: number) => {
    openDialog({
      title: '콘텐츠 복제',
      content: '콘텐츠를 복제하시겠습니까?',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        closeDialog();
        showLoading();
        mutate(id);
      },
    });
  };

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [hideLoading, isLoading, showLoading]);

  return {
    form: {
      formMethod,
      handleSubmit: handleFormSubmit,
      handleReset,
    },
    keywordComboList,
    contentList: data?.content ?? [],
    isLoading,
    pagination: {
      limit: Number(queryState.size) || 10,
      page: Number(queryState.page) || 1,
      total: data?.totalElements || 0,
      onChange: handleChangePagination,
    },
    getValues,
    handleChangeDateRange,
    handleChangeContentType,
    handleReset,
    handleAfterCreator,
    handleAfterModify,
    handleDuplicate,
  };
};
