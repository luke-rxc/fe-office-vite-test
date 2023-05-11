import { useDialog } from '@hooks/useDialog';
import { useQuery } from '@hooks/useQuery';
import { useQueryState } from '@hooks/useQueryState';
import { DialogType } from '@models/DialogModel';
import { toDateFormat } from '@utils/date';
import { addDays } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getExcelData, getMemberList } from '../apis';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE, EXCEL_DOWNLOAD_SIZE, EXCEL_HEADER_LIST } from '../constants';
import {
  MemberExcelModel,
  toDateFormField,
  toMemberExcelModel,
  toMemberFormField,
  toMemberModel,
  toMemberQueryParam,
  toMemberQueryState,
} from '../models';
import { MemberListQueryState, MemberSearchFormField } from '../types';
import isEmpty from 'lodash/isEmpty';
import { useMutation } from '@hooks/useMutation';
import { excelExport } from '@utils/excel';
import useLoading from '@hooks/useLoading';
import { searchFormValidation } from '../utils';

const defaultFormValues = {
  searchType: 'EMAIL',
  keyword: '',
  userStatus: 'ACTIVE',
  joinFromDate: null,
  joinToDate: null,
  loginFromDate: null,
  loginToDate: null,
  page: DEFAULT_PAGE_OFFSET,
  size: DEFAULT_PAGE_SIZE,
  isBlack: false,
};

export const useMemberManagementListService = () => {
  const dialog = useDialog();
  const { showLoading, hideLoading } = useLoading();
  const { queryState, updateQueryState } = useQueryState<MemberListQueryState>({
    joinFromDate: addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7).getTime(),
    joinToDate: new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`).getTime(),
    loginFromDate: 'ALL',
    loginToDate: 'ALL',
    isBlack: '',
  });

  const processing = useRef(false);
  const formMethod = useForm<MemberSearchFormField>({
    defaultValues: {
      ...defaultFormValues,
      joinFromDate: toDateFormField(queryState.joinFromDate, null),
      joinToDate: toDateFormField(queryState.joinToDate, null),
      loginFromDate: toDateFormField(queryState.loginFromDate, null),
      loginToDate: toDateFormField(queryState.loginToDate, null),
      isBlack: queryState.isBlack === 'T',
    },
    resolver: yupResolver(searchFormValidation),
  });
  const { handleSubmit, getValues, reset, setValue } = formMethod;

  const { data: memberList, isLoading } = useQuery(
    ['member', toMemberQueryParam(queryState, defaultFormValues)],
    () => {
      const queryParam = toMemberQueryParam(queryState, defaultFormValues);
      return getMemberList(queryParam);
    },
    {
      select: (res) => {
        return {
          ...res,
          content: res.content.map(toMemberModel),
        };
      },
      onError: (err) => {
        dialog.open({
          content: err.data.message,
          type: DialogType.ALERT,
        });
      },
      enabled: !isEmpty(queryState),
    },
  );

  const { mutateAsync: getMemberExcelList } = useMutation(getExcelData);

  const onSubmit = handleSubmit(async () => {
    const state = { ...queryState, page: `${DEFAULT_PAGE_OFFSET}` };
    updateQueryState({ ...toMemberQueryState(state, getValues()) });
  });

  const onReset = () => {
    const resetFormValues = toMemberFormField({} as MemberListQueryState, {
      ...defaultFormValues,
      joinFromDate: toDateFormat(addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -7).getTime()),
      joinToDate: toDateFormat(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`).getTime()),
    });
    reset({ ...resetFormValues, loginFromDate: null, loginToDate: null });
  };

  const calcDateRange = (range: number) => {
    if (range === -1) {
      return {
        fromDate: null,
        toDate: null,
      };
    }

    const fromDate = Number.isInteger(range)
      ? addDays(new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 00:00:00`), -range)
      : null;
    const toDate = Number.isInteger(range) ? new Date(`${toDateFormat(new Date(), 'yyyy/MM/dd')} 23:59:59`) : null;

    return {
      fromDate: toDateFormat(fromDate),
      toDate: toDateFormat(toDate),
    };
  };

  const handleChangeJoinDateRange = (range: number) => {
    const { fromDate, toDate } = calcDateRange(range);

    setValue('joinFromDate', fromDate);
    setValue('joinToDate', toDate);
  };

  const handleChangeLoginDateRange = (range: number) => {
    const { fromDate, toDate } = calcDateRange(range);

    setValue('loginFromDate', fromDate);
    setValue('loginToDate', toDate);
  };

  const handlePageChange = (page: number, size: number) => {
    updateQueryState({
      ...queryState,
      page: page.toString(),
      size: size.toString(),
    });
  };

  const downloadMemberList = async (size: number, page: number): Promise<MemberExcelModel[]> => {
    const res = await getMemberExcelList({
      ...toMemberQueryParam(queryState, defaultFormValues),
      size,
      page,
    });

    if (res.totalPages === page) {
      return res.content.map(toMemberExcelModel);
    }

    const nextList = await downloadMemberList(size, page + 1);
    return res.content.map(toMemberExcelModel).concat(nextList);
  };

  const handleDownloadAll = async () => {
    if (processing.current) {
      return;
    }
    try {
      showLoading();
      processing.current = true;
      const list = await downloadMemberList(EXCEL_DOWNLOAD_SIZE, 1);

      excelExport({
        sheetData: list,
        headers: [EXCEL_HEADER_LIST],
        autoFit: true,
        autoFitRatio: 1.5,
        columnMinSize: 8,
        fileName: '회원목록.xlsx',
      });
    } catch (e) {
      dialog.open({
        content: e.data.message,
        type: DialogType.ALERT,
      });
      console.error(e);
    } finally {
      processing.current = false;
      hideLoading();
    }
  };

  useEffect(() => {
    reset(toMemberFormField(queryState, getValues()));
  }, [queryState, getValues, reset]);

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return {
    memberList: memberList?.content ?? [],
    isLoading,
    form: {
      formMethod,
      onSubmit,
      onReset,
      onChangeJoinDateRange: handleChangeJoinDateRange,
      onChangeLoginDateRange: handleChangeLoginDateRange,
    },
    pagination: {
      limit: Number(queryState.size) || DEFAULT_PAGE_SIZE,
      page: Number(queryState.page) || DEFAULT_PAGE_OFFSET,
      total: memberList?.totalElements ?? 0,
      onChange: handlePageChange,
    },
    action: {
      onDownloadAll: handleDownloadAll,
    },
  };
};
