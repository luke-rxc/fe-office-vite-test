import { UseFormReturn } from 'react-hook-form';
import { QueryState } from '@hooks/useQueryState';
import { toDateFormat } from '@utils/date';
import {
  REPLY_SEARCH_DATE_TYPE,
  REPLY_SEARCH_TYPE,
  REPLY_STATUS_TYPE,
  REPLY_STATUS_TYPE_LABEL,
  REPLY_USER_STATUS_TYPE,
  REPLY_USER_STATUS_TYPE_LABEL,
} from '../constants';
import { ReplyListPageSchema, ReplyListSchema } from '../schemas';

/**
 * content form props
 */
export type ContentReplyFormProps<T> = {
  formMethod: UseFormReturn<T>;
  handleSubmit: (e?: any) => Promise<void>;
  handleReset: () => void;
};

/**
 * 검색 폼 필드
 */
export type ReplySearchFieldModel = {
  // 사용자 검색 타입 - 이메일/닉네임
  searchType: REPLY_SEARCH_TYPE;
  // 사용자 검색어
  keyword: string;
  // 기간조회 타입 - 전체 기간 / 댓글 작성일 / 댓글 삭제일 / 관리자 처리일
  periodDateType: REPLY_SEARCH_DATE_TYPE;
  // 기간 시작일
  startDate: number | string;
  // 기간 종료일
  endDate: number | string;
  // 댓글 상태
  status: REPLY_STATUS_TYPE | '';
  // 신고 댓글 모아보기
  isReport: boolean;
  // 정렬
  sort: string[];
};

/**
 * Reply 리스트 query string state
 */
export type ReplyListQueryState = QueryState & {
  size: string;
  page: string;
  sort: string;
  // 사용자 검색 타입 - 이메일/닉네임
  searchType: string;
  // 사용자 검색어
  keyword: string;
  // 기간조회 타입 - 전체 기간 / 댓글 작성일 / 댓글 삭제일 / 관리자 처리일
  periodDateType: string;
  // 기간 시작일
  startDate: string;
  // 기간 종료일
  endDate: string;
  // 댓글 상태
  status: REPLY_STATUS_TYPE | '';
  // 신고 댓글 모아보기
  isReport: string;
};

export const toFormField = (queryState: ReplyListQueryState, defaultFormValues: ReplySearchFieldModel): any => {
  const { startDate, endDate, isReport, sort } = queryState;
  const fields = {
    ...defaultFormValues,
    ...queryState,
    startDate: Number.isInteger(Number(startDate)) ? Number(startDate) : '',
    endDate: Number.isInteger(Number(endDate)) ? Number(endDate) : '',
    isReport: isReport === 'true',
    sort: sort ? sort.split(',') : '',
  };
  return fields;
};

export type RequestParams = {
  page: string;
  size: string;
  periodDateType: string;
  startDate: number;
  endDate: number;
  searchType: string;
  keyword: string;
  status: string;
  isReport: string;
  sort: string;
};

/**
 * FormField -> Query State 로 convert
 */
export const toQueryState = (
  formField: ReplySearchFieldModel,
  currentQueryState?: ReplyListQueryState,
): ReplyListQueryState => {
  const { startDate, endDate, isReport, sort } = formField;
  return {
    ...currentQueryState,
    ...formField,
    startDate: startDate ? startDate.toString() : '',
    endDate: endDate ? endDate.toString() : '',
    isReport: isReport ? 'true' : '',
    sort: sort ? sort.join() : '',
  };
};

/**
 *  Query State -> api query param convert
 */
export const toQueryParams = (queryState: ReplyListQueryState): RequestParams => {
  const { size, page, searchType, keyword, periodDateType, startDate, endDate, status, isReport, sort } = queryState;

  return {
    size,
    page,
    searchType: searchType ?? REPLY_SEARCH_TYPE.USER_NICKNAME,
    keyword,
    periodDateType: periodDateType === REPLY_SEARCH_DATE_TYPE.ALL ? '' : periodDateType,
    startDate: Number.isInteger(Number(startDate)) ? Number(startDate) : null,
    endDate: Number.isInteger(Number(endDate)) ? Number(endDate) : null,
    status,
    isReport,
    sort,
  };
};

/**
 * reply model list convert
 */
export const toReplyList = (items: ReplyListSchema[]): ReplyListModel[] => {
  return items.map((item) => {
    return {
      ...item,
    };
  });
};

/**
 * 콘텐츠 댓글 리스트 모델
 */
export type ReplyListModel = {
  id: number;
  createdDate: string;
  deleteDate: string;
  contents: string;
  user: ReplyUserModel;
  reportCount: number;
  status: REPLY_STATUS_TYPE;
  history: ReplyHistoryModel;
  replyCount: number;
  reportReasonCounts: ReplyReportModel[];
};

export type ReplyUserModel = {
  email: string;
  id: number;
  nickname: string;
  status: REPLY_USER_STATUS_TYPE;
};

export type ReplyHistoryModel = {
  email: string;
  id: number;
  status: REPLY_STATUS_TYPE;
  updatedDate: string;
};

export type ReplyReportModel = {
  count: number;
  id: number;
  reason: string;
};

export const toReplyExcelModelList = (data: ReplyListPageSchema) => {
  return {
    ...data,
    content: toReplyExcelList(data.content),
    exportMeta: data?.exportMeta,
  };
};

export const toReplyExcelList = (items: ReplyListSchema[]): ReplyListExcelModel[] => {
  return items.map((item) => {
    const { id, createdDate, deleteDate, contents, user, reportCount, status, history, reportReasonCounts } = item;
    return {
      id,
      createdDate: toDateFormat(createdDate),
      deleteDate: deleteDate ? toDateFormat(deleteDate) : '-',
      contents,
      userId: user.id,
      userNickname: user.nickname,
      userEmail: user.email,
      userStatus: REPLY_USER_STATUS_TYPE_LABEL[user.status],
      reportCount,
      reportDetail: getReportCountInfo(reportReasonCounts),
      status: REPLY_STATUS_TYPE_LABEL[status],
      adminUpdatedDate: history ? toDateFormat(history.updatedDate) : '-',
    };
  });
};

const getReportCountInfo = (reportReasonCounts: ReplyReportModel[]) => {
  if (!reportReasonCounts) {
    return '';
  }
  const text = reportReasonCounts.map((report) => {
    const { reason, count } = report;
    return `${reason} ${count}`;
  });
  return text.join(', ');
};

export type ReplyListExcelModel = {
  id: number;
  createdDate: string;
  deleteDate: string;
  contents: string;
  userId: number;
  userNickname: string;
  userEmail: string;
  userStatus: string;
  reportCount: number;
  reportDetail: string;
  status: string;
  adminUpdatedDate: string; // 관리자 처리일
};
