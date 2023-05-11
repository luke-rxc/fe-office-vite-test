/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { stringifyUrl } from '../utils';
import { SettlementListItem, SettlementSearchForm, SettlementSearchFormOptions } from '../types';
import { SettlementSearchFormDefaultValues, SettlementCountOptions, SettlementRoundOptions } from '../constants';
import { toSettlementSearchFormModel } from '../models';
import { useSettlementExecuteMutation } from './mutations';
import { useSettlementListQuery, SettlementListQueryKeys } from './queries';

/** 정산 목록 Service */
export const useSettlementListService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dialog = useDialog();
  const { pathname, search } = useLocation();
  const [searchValues, setSearchValues] = useState<SettlementSearchForm>(toSettlementSearchFormModel(search));

  /** 목록 검색 폼 */
  const formMethods = useForm<SettlementSearchForm>({ defaultValues: searchValues });
  /** 목록 검색폼 옵션 리스트 */
  const formOptions: SettlementSearchFormOptions = { count: SettlementCountOptions, round: SettlementRoundOptions };

  /** 목록 조회 Mutation */
  const listQuery = useSettlementListQuery(searchValues);
  /** 정산 처리 Mutation */
  const executeMutation = useSettlementExecuteMutation({
    onSuccess: () => queryClient.refetchQueries(SettlementListQueryKeys.lists(), { active: true }),
  });

  /** 검색 업데이트 */
  const updateSearch = (values: SettlementSearchForm, queryClear?: boolean) => {
    formMethods.reset(values);
    setSearchValues(values);
    navigate(stringifyUrl({ url: pathname, query: queryClear ? {} : { ...values } }));
  };

  /** 정산 목록 검색 */
  const handleSearch = formMethods.handleSubmit((values) => {
    updateSearch({ ...values, page: SettlementSearchFormDefaultValues.page });
  });

  /** 정산 목록 폼 초기화 */
  const handleSearchFormReset = () => {
    updateSearch(SettlementSearchFormDefaultValues, true);
  };

  /** pagination 변경*/
  const handleChangePagination = useCallback(
    (page: number, size: number) => {
      updateSearch({ ...searchValues, size, page });
    },
    [searchValues],
  );

  /** 정산 요청 */
  const handleSettlementExecute = (settlementItem: SettlementListItem) => {
    const { yyyyMm, round, count } = settlementItem;
    dialog.open({
      type: DialogType.CONFIRM,
      content: `정말 정산을 진행하시겠습니까?\n${yyyyMm}(${count}/${round})`,
      onConfirm: () => {
        executeMutation.mutateAsync(settlementItem);
        dialog.close();
      },
    });
  };

  return {
    list: listQuery?.data?.content || [],
    total: listQuery?.data?.totalElements || 0,
    isLoading: listQuery.isLoading,
    formMethods,
    formOptions,
    handleSearch,
    handleSearchFormReset,
    handleSettlementExecute,
    handleChangePagination,
  };
};
