/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { stringifyUrl } from '../utils';
import { useUserType } from '../hooks';
import { toProviderSettlementSearchFormModel } from '../models';
import {
  ProviderSettlementListItem,
  ProviderSettlementSearchForm,
  ProviderSettlementSearchFormOptions,
} from '../types';
import {
  ProviderSettlementSearchFormDefaultValues,
  SettlementRoundOptions,
  SettlementCountOptions,
  SettlementPaidOptions,
  SettlementTaxOptions,
} from '../constants';

import {
  usePaidPriceMutation,
  useExcelByProviderSettlementMutation,
  useExcelByProviderSettlementListMutation,
  usePublishTaxBillMutation,
  useSettlementReExecuteMutation,
} from './mutations';
import { useProviderNamesQuery, useProviderSettlementListQuery, ProviderSettlementListQueryKeys } from './queries';

/** 입점사별 정산 목록 Service */
export const useProviderSettlementListService = () => {
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { isManager } = useUserType();
  /** 현재 리스트의 검색 조건 */
  const [searchValues, setSearchValues] = useState<ProviderSettlementSearchForm>(
    toProviderSettlementSearchFormModel(search),
  );
  /** only manager - 선택된 테이블 아이디 리스트 */
  const [checkboxIds, setCheckboxIds] = useState<number[]>([]);

  /** 정산 목록 Query */
  const listQuery = useProviderSettlementListQuery(searchValues);
  /** 엑셀용 모든 정산 데이터 조회 Mutation */
  const excelByListMutation = useExcelByProviderSettlementListMutation();
  /** 엑셀용 특정 정산 데이터 조회 Mutation */
  const excelByItemMutation = useExcelByProviderSettlementMutation();

  /** refetch search list */
  const refetchListQuery = () => {
    queryClient.refetchQueries(ProviderSettlementListQueryKeys.list(searchValues), { active: true });
    setCheckboxIds([]);
  };

  /** only manager - 정산금 지급 Mutation */
  const paidPriceMutation = usePaidPriceMutation({ onSuccess: refetchListQuery });
  /** only manager - 세금 계산서 발급 Mutation */
  const publishTaxBillMutation = usePublishTaxBillMutation({ onSuccess: refetchListQuery });
  /** only manager - 재정산 요청 Mutation */
  const reExecuteMutation = useSettlementReExecuteMutation({ onSuccess: refetchListQuery });
  /** only manager - 콤보박스를 위한 입점사명 리스트 Query */
  const providerNamesQuery = useProviderNamesQuery({ enabled: isManager });

  /** 목록 검색 폼 */
  const formMethods = useForm<ProviderSettlementSearchForm>({ defaultValues: searchValues });
  /** 목록 검색폼 옵션 리스트 */
  const formOptions: ProviderSettlementSearchFormOptions = {
    tax: SettlementTaxOptions,
    paid: SettlementPaidOptions,
    count: SettlementCountOptions,
    round: SettlementRoundOptions,
    /** only manager 입점사 리스트 */
    providerName: providerNamesQuery?.data || [],
  };

  /** 검색 업데이트 */
  const updateSearch = (values: ProviderSettlementSearchForm, queryClear?: boolean) => {
    formMethods.reset(values);
    setCheckboxIds([]);
    setSearchValues(values);
    navigate(stringifyUrl({ url: pathname, query: queryClear ? {} : { ...values } }));
  };

  /** 검색 요청 */
  const handleSearch = formMethods.handleSubmit((values) => {
    updateSearch({ ...values, page: ProviderSettlementSearchFormDefaultValues.page });
  });

  /** 검색폼 초기화 */
  const handleResetSearchForm = () => {
    updateSearch(ProviderSettlementSearchFormDefaultValues, true);
  };

  /** pagination 변경*/
  const handleChangePagination = useCallback(
    (page: number, size: number) => {
      updateSearch({ ...searchValues, size, page });
    },
    [searchValues],
  );

  /** 엑셀 다운로드 */
  const handleExportExcel = (item: ProviderSettlementListItem) => {
    excelByItemMutation.mutateAsync(item);
  };

  /** 전체 엑셀 다운로드 */
  const handleAllExportExcel = () => {
    excelByListMutation.mutateAsync(searchValues);
  };

  /** only manager - 선택된 테이블 체크박스 리스트 변경 */
  const handleChangeCheckboxIds = (ids: typeof checkboxIds) => {
    setCheckboxIds(ids);
  };

  /** only manager - 재정산 요청 */
  const handleSettlementReExecute = (item: ProviderSettlementListItem) => {
    const { id, providerName, yyyyMm } = item;
    dialog.open({
      type: DialogType.CONFIRM,
      content: `재정산을 하시겠습니까?\n${providerName}/${yyyyMm} `,
      onConfirm: () => {
        reExecuteMutation.mutateAsync({ id });
        dialog.close();
      },
    });
  };

  /** only manager - 정산금 지급 요청 */
  const handlePaidPrice = (ids: typeof checkboxIds) => {
    dialog.open({
      type: DialogType.CONFIRM,
      content: `정산금을 지급합니다. (총 ${ids.length}건)`,
      onConfirm: () => {
        paidPriceMutation.mutateAsync({ ids });
        dialog.close();
      },
    });
  };

  /** only manager - 세금 계산서 발행 요청 */
  const handlePublishTaxBill = (ids: typeof checkboxIds) => {
    dialog.open({
      type: DialogType.CONFIRM,
      content: `세금 계산서를 발행합니다. (총 ${ids.length}건)`,
      onConfirm: () => {
        publishTaxBillMutation.mutateAsync({ ids });
        dialog.close();
      },
    });
  };

  return {
    list: listQuery?.data?.content || [],
    total: listQuery?.data?.totalElements || 0,
    isLoading: listQuery.isLoading,
    isManager,
    formMethods,
    formOptions,
    checkboxIds,
    handleSearch,
    handleResetSearchForm,
    handleChangePagination,
    handleChangeCheckboxIds,
    handleSettlementReExecute,
    handlePaidPrice,
    handlePublishTaxBill,
    handleExportExcel,
    handleAllExportExcel,
  };
};
