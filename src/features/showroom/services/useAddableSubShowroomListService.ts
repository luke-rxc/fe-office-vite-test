/* eslint-disable react-hooks/exhaustive-deps */
import toast from 'react-hot-toast';
import includes from 'lodash/includes';
import toNumber from 'lodash/toNumber';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { isIncluded } from '../utils';
import {
  ShowroomSearchFieldDefaultValues,
  ShowroomSearchTypeOptionsForSearch,
  UnAddableSubShowroomStatutes,
} from '../constants';
import { ShowroomListItem, ShowroomSearchFields, ShowroomSearchFieldOptions, ArrayElement } from '../types';
import { useAddableSubShowroomListQuery } from './queries';

export interface UseAddableSubShowroomListServiceProps {
  /** 검색에서 제외할 쇼룸 Ids */
  exceptIds?: number[];
}

/**
 * 소속쇼룸 목록 조회 Service
 */
export const useAddableSubShowroomListService = ({ exceptIds }: UseAddableSubShowroomListServiceProps) => {
  const { id } = useParams();

  /**
   * 쇼룸ID
   */
  const showroomId = toNumber(id);

  /**
   * 선택된 소속쇼룸 목록
   */
  const [selectedItems, setSelectedItems] = useState<ShowroomListItem[]>([]);

  /**
   * 선택된 소속쇼룸의 ID 목록 (테이블 props를 위한 값)
   */
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  /**
   * 목록 검색 값 === 현재 검색결과의 Field Value
   */
  const [searchValues, setSearchValues] = useState<ShowroomSearchFields>({
    ...ShowroomSearchFieldDefaultValues,
    exceptShowRoomIds: exceptIds,
  });

  /**
   * 검색 필드 값 === 현재 Field에 입력되어 있는 Value
   */
  const formMethods = useForm<ShowroomSearchFields>({ defaultValues: searchValues });

  /**
   * 목록 조회 Query
   */
  const listQuery = useAddableSubShowroomListQuery({ showroomId, ...searchValues });

  /**
   * 검색 필드 옵션
   */
  const formOptions: Pick<ShowroomSearchFieldOptions, 'searchType'> = {
    searchType: ShowroomSearchTypeOptionsForSearch,
  };

  /**
   * 검색 업데이트
   */
  const updateSearch = (values: ShowroomSearchFields) => {
    formMethods.reset(values);
    setSearchValues(values);
  };

  /**
   * 추가 가능 소속쇼룸여부 판단
   */
  const isAddableItem = (item?: ShowroomListItem) => {
    if (!item) {
      return false;
    }

    return !includes(UnAddableSubShowroomStatutes, item.status);
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
   * 소속쇼룸 선택/선택취소
   */
  const handleChangeSelectItem = (
    id: ArrayElement<typeof selectedItemIds>,
    item?: ArrayElement<typeof selectedItems>,
  ) => {
    const select = selectedItems.findIndex((selectedItem) => selectedItem.id === id) <= -1;
    const addable = isAddableItem(item);

    // 선택 취소
    if (!select) {
      return setSelectedItems(selectedItems.filter((item) => item.id !== id));
    }

    // 선택 => 가능
    if (select && addable) {
      return setSelectedItems([...selectedItems, item]);
    }

    // 선택 => 불가능
    return toast.error('공개 상태인 쇼룸만 추가할 수 있습니다');
  };

  /**
   * 소속쇼룸 전체 선택/선택취소
   */
  const handleToggleSelectItemAll = (selectAll: boolean) => {
    const items = listQuery?.data?.content || [];

    if (selectAll) {
      const addableItems = items.filter((item) => !isIncluded(selectedItems, item) && isAddableItem(item));
      setSelectedItems([...selectedItems, ...addableItems]);
    } else {
      const filteredItems = selectedItems.filter((item) => !isIncluded(items, item));
      setSelectedItems(filteredItems);
    }
  };

  /**
   * 소속쇼룸 검색
   */
  const handleSearch = formMethods.handleSubmit((values) => {
    updateSearch({ ...values, page: ShowroomSearchFieldDefaultValues.page });
  });

  /**
   * 검색 필드 초기화
   */
  const handleResetSearchForm = () => {
    updateSearch({ ...ShowroomSearchFieldDefaultValues, exceptShowRoomIds: exceptIds });
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
