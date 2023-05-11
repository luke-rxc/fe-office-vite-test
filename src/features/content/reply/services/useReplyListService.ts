import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { isDate } from 'date-fns';
import { SortOrderType } from '@constants/table';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { toDateFormat } from '@utils/date';
import { excelExport } from '@utils/excel';
import { getReplyList } from '../apis';
import { ExcelExportListHeader, QUERY_KEY, REPLY_SEARCH_DATE_TYPE, REPLY_SEARCH_TYPE } from '../constants';
import {
  ReplyListQueryState,
  ReplySearchFieldModel,
  toFormField,
  toQueryParams,
  toQueryState,
  toReplyList,
  toReplyExcelModelList,
} from '../models';

/**
 * form 기본값
 */
const defaultFormValues: ReplySearchFieldModel = {
  // 사용자 검색 타입 - 이메일/닉네임
  searchType: REPLY_SEARCH_TYPE.USER_NICKNAME,
  // 사용자 검색어
  keyword: '',
  // 댓글 상태
  status: '',
  // 기간조회 타입 - 전체 기간 / 댓글 작성일 / 댓글 삭제일 / 관리자 처리일
  periodDateType: REPLY_SEARCH_DATE_TYPE.ALL,
  // 기간 시작일
  startDate: null,
  // 기간 종료일
  endDate: null,
  // 신고 댓글 모아보기
  isReport: false,
  sort: [],
};

export const useReplyListService = () => {
  const client = useQueryClient();
  const { id } = useParams();
  const { showLoading, hideLoading } = useLoading();

  const { queryState, updateQueryState } = useQueryState<ReplyListQueryState>({
    page: '1',
    size: '10',
  });

  // query string -> formField
  const formField = useMemo(
    () => toFormField(queryState, defaultFormValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryState],
  );

  const formMethod = useForm<ReplySearchFieldModel>({
    defaultValues: formField,
  });
  const { reset, handleSubmit, setError } = formMethod;

  const { data, isLoading } = useQuery(
    [QUERY_KEY.REPLY_LIST, id, toQueryParams(queryState)],
    () => getReplyList(+id, toQueryParams(queryState)),
    {
      select: (data) => {
        return {
          ...data,
          content: toReplyList(data.content),
        };
      },
      cacheTime: 0,
    },
  );

  /**
   * 검색 필터 초기화
   */
  const handleReset = () => {
    const resetData: ReplySearchFieldModel = {
      ...defaultFormValues,
    };

    reset(resetData);
    updateQueryState(toQueryState(resetData, queryState));
  };

  /**
   * 검색 submit
   */
  const handleFormSubmit = handleSubmit((values) => {
    const { startDate, endDate } = values;
    const start = getDateValues(startDate);
    const end = getDateValues(endDate);

    if (!!start && !!end && start > end) {
      setError('startDate', {
        type: 'manual',
        message: '날짜를 확인해 주세요.',
      });
      setError('endDate', {
        type: 'manual',
        message: '날짜를 확인해 주세요.',
      });
      return;
    }

    const newQueryState = toQueryState(
      {
        ...values,
        startDate: start,
        endDate: end,
      },
      queryState,
    );

    updateQueryState({
      ...newQueryState,
      page: '1',
    });
  });

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

  const [sortValue, setSortValue] = useState<{ orderType: SortOrderType; orderKey: string }>({
    orderType: SortOrderType.ASC,
    orderKey: undefined,
  });
  const handleSort = (orderKey: string, orderType: SortOrderType) => {
    setSortValue({ orderKey, orderType });
    updateQueryState({
      ...queryState,
      sort: [orderKey, orderType].join(),
    });
  };

  const handleReloadList = () => {
    client.invalidateQueries([QUERY_KEY.REPLY_LIST, id, toQueryParams(queryState)]);
  };

  const handleAllListExport = async () => {
    try {
      const res = await getReplyList(+id, {
        size: '100000',
        page: '1',
        periodDateType: '',
        startDate: null,
        endDate: null,
        searchType: '',
        keyword: '',
        status: '',
        isReport: 'false',
        sort: '',
      });

      const allData = toReplyExcelModelList(res);
      if (allData?.content && allData?.content?.length > 0) {
        const { contentName, showRoomName } = allData.exportMeta;
        const today = toDateFormat(new Date(), 'yyyyMMdd');
        const fileName = `${today}_${showRoomName}_${contentName}_댓글.xlsx`;
        excelExport({
          sheetData: allData.content,
          headers: [ExcelExportListHeader],
          autoFit: true,
          autoFitRatio: 1.5,
          columnMinSize: 8,
          fileName,
        });
      }
    } catch (e) {
      toast.error('엑셀파일 다운로드에 실패하였습니다. 잠시 후 다시 한번 시도해 주세요');
    }
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
    replyList: data?.content ?? [],
    isLoading,
    pagination: {
      limit: Number(queryState.size) || 10,
      page: Number(queryState.page) || 1,
      total: data?.totalElements || 0,
      onChange: handleChangePagination,
    },
    sort: {
      orderKey: sortValue.orderKey,
      orderType: sortValue.orderType,
      handleSort,
    },
    handleReloadList,
    handleAllListExport,
  };
};

/**
 * 날짜값 조회
 */
const getDateValues = (dateValue: number | string) => {
  return Number.isInteger(dateValue) ? dateValue : isDate(dateValue) ? new Date(dateValue).getTime() : undefined;
};
