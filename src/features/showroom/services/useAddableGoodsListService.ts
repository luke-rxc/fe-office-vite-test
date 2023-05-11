/* eslint-disable react-hooks/exhaustive-deps */
import toNumber from 'lodash/toNumber';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { isIncluded } from '../utils';
import { useShowroom } from '../hooks';
import { GoodsSearchFieldDefaultValues, GoodsStatusOptions, GoodsSearchTypeOptions } from '../constants';
import { GoodsListItem, GoodsSearchFields, GoodsSearchFieldOptions, ArrayElement } from '../types';
import { useAddableGoodsListQuery, useBrandComboListQuery, useProviderComboListQuery } from './queries';

export interface UseAddableGoodsListServiceProps {
  /** 검색에서 제외할 상품 Ids */
  exceptIds?: number[];
}

/**
 * 전시상품 목록 조회 Service
 */
export const useAddableGoodsListService = ({ exceptIds: exceptGoodsIds }: UseAddableGoodsListServiceProps) => {
  const params = useParams();
  const showroom = useShowroom();

  /**
   * 쇼룸ID
   */
  const showroomId = toNumber(params.id) || showroom.id;

  /**
   * 섹션 ID
   */
  const sectionId = toNumber(params.sectionId) || showroom.sectionId;

  /**
   * 선택된 전시상품 목록
   */
  const [selectedItems, setSelectedItems] = useState<GoodsListItem[]>([]);

  /**
   * 선택된 전시상품의 ID 목록 (테이블 props를 위한 값)
   */
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  /**
   * 목록 검색 값 === 현재 검색결과의 Field Value
   */
  const [searchValues, setSearchValues] = useState<GoodsSearchFields>({
    ...GoodsSearchFieldDefaultValues,
    exceptGoodsIds,
  });

  /**
   * 검색 필드 값 === 현재 Field에 입력되어 있는 Value
   */
  const formMethods = useForm<GoodsSearchFields>({ defaultValues: searchValues });

  /**
   * 입점사ID - 브랜드를 제어하기 위한 트래킹값
   */
  const providerId = formMethods.watch('provider')?.id;

  /**
   * 목록 조회 Query
   */
  const listQuery = useAddableGoodsListQuery({ showroomId, sectionId, ...searchValues });

  /**
   * 입점사 콤보 Query
   */
  const providerComboQuery = useProviderComboListQuery({});

  /**
   * 브랜드 콤보 Query
   */
  const brandComboQuery = useBrandComboListQuery({ providerId });

  /**
   * 검색 필드 옵션
   */
  const formOptions: GoodsSearchFieldOptions = {
    status: GoodsStatusOptions,
    searchType: GoodsSearchTypeOptions,
    brand: brandComboQuery?.data || [],
    provider: providerComboQuery?.data || [],
  };

  /**
   * 검색 업데이트
   */
  const updateSearch = (values: GoodsSearchFields) => {
    formMethods.reset(values);
    setSearchValues(values);
  };

  /**
   * 선택된 모든 아이템 중 테이블에 노출되고 있는 요소의 Id만 리스트를 반환
   */
  const getSelectedItemIdsInTable = (selectItems: typeof selectedItems) => {
    const tableItems = listQuery?.data?.content || [];

    return selectItems.reduce<number[]>(
      (ids, selectItem) => (isIncluded(tableItems, selectItem) ? [...ids, selectItem.id] : ids),
      [],
    );
  };

  /**
   * 전시상품 선택/선택취소
   */
  const handleChangeSelectItem = (
    id: ArrayElement<typeof selectedItemIds>,
    item?: ArrayElement<typeof selectedItems>,
  ) => {
    const select = selectedItems.findIndex((selectedItem) => selectedItem.id === id) <= -1;

    return select
      ? setSelectedItems([...selectedItems, item])
      : setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  /**
   * 전시 상품 전체 선택/선택취소
   */
  const handleToggleSelectItemAll = (selectAll: boolean) => {
    const items = listQuery?.data?.content || [];

    if (selectAll) {
      const addableItems = items.filter((item) => !isIncluded(selectedItems, item));
      setSelectedItems([...selectedItems, ...addableItems]);
    } else {
      const filteredItems = selectedItems.filter((item) => !isIncluded(items, item));
      setSelectedItems(filteredItems);
    }
  };

  /**
   * 전시상품 검색
   */
  const handleSearch = formMethods.handleSubmit((values) => {
    updateSearch({ ...values, page: GoodsSearchFieldDefaultValues.page });
  });

  /**
   * 검색 필드 초기화
   */
  const handleResetSearchForm = () => {
    updateSearch({ ...GoodsSearchFieldDefaultValues, exceptGoodsIds });
  };

  /**
   * pagination 변경
   */
  const handleChangePagination = useCallback(
    (page: number, size: number) => {
      updateSearch({ ...searchValues, size, page });
    },
    [searchValues],
  );

  /**
   * 입점사필드 값이 변경된면 브랜드필드 초기화
   */
  useEffect(() => {
    formMethods.setValue('brand', GoodsSearchFieldDefaultValues.brand);
  }, [providerId]);

  /**
   * 테이블 데이터 혹은 선택된 아이템 리스트가 변경되면 selectedItemIds update
   */
  useEffect(() => {
    setSelectedItemIds(getSelectedItemIdsInTable(selectedItems));
  }, [listQuery?.data, selectedItems]);

  return {
    list: listQuery?.data?.content || [],
    total: listQuery?.data?.totalElements || 0,
    isLoading: listQuery.isLoading,
    formMethods,
    formOptions,
    selectedItems,
    selectedItemIds,
    handler: {
      search: handleSearch,
      searchReset: handleResetSearchForm,
      changePagination: handleChangePagination,
      changeSelectItem: handleChangeSelectItem,
      changeSelectItemAll: handleToggleSelectItemAll,
    },
  };
};
