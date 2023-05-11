import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import isEqual from 'lodash/isEqual';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { getGoodsList } from '../apis';
import { GOODS_SEARCH_TYPE, QUERY_KEY } from '../constants';
import {
  GoodsListQueryState,
  GoodsModel,
  GoodsSearchFieldModel,
  toGoodsListModel,
  toGoodsQueryParams,
} from '../models';

const DefaultFormValues: GoodsSearchFieldModel = {
  searchType: GOODS_SEARCH_TYPE.NAME,
  status: '',
  providerId: [],
  brandId: [],
  keyword: '',
  isMyBrand: false,
  page: 1,
  size: 10,
};

/**
 * 상품 리스트 조회
 */
export const useGoodsListService = (list: GoodsModel[] = []) => {
  const { id } = useParams();
  const formMethod = useForm<GoodsSearchFieldModel>({
    defaultValues: DefaultFormValues,
  });
  const { reset, handleSubmit } = formMethod;
  const { showLoading, hideLoading } = useLoading();
  const [searchValues, setSearchValues] = useState<GoodsListQueryState>({ ...DefaultFormValues }); // 검색 쿼리정보
  const [selectedItems, setSelectedItems] = useState<GoodsModel[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // table 표시를 위한 id 리스트.

  const { data, isLoading } = useQuery(
    [QUERY_KEY.GOODS_LIST, id, searchValues],
    () => getGoodsList(id, toGoodsQueryParams(searchValues, list)),
    {
      select: (data) => ({
        ...data,
        content: toGoodsListModel(data?.content),
      }),
      cacheTime: 0,
    },
  );

  /**
   * 선택된 모든 아이템 중 테이블에 노출되고 있는 요소의 Id만 리스트를 반환
   */
  const getSelectedItemIdsInTable = (selectItems: typeof selectedItems) => {
    const tableItems = data?.content || [];

    return selectItems.reduce<number[]>(
      (ids, selectItem) => (isIncluded(tableItems, selectItem) ? [...ids, selectItem.goodsId] : ids),
      [],
    );
  };

  /**
   * 리스트 단일 check / uncheck
   */
  const handleChangeSelect = (id: number, item?: GoodsModel) => {
    const select = selectedItems.findIndex((selectedItem) => selectedItem.goodsId === id) <= -1;
    return select
      ? setSelectedItems([...selectedItems, item])
      : setSelectedItems(selectedItems.filter((item) => item.goodsId !== id));
  };

  /**
   * 리스트 전체 check / uncheck
   */
  const handleChangeSelectAll = (selectAll: boolean) => {
    const targetItems = data?.content || [];

    if (selectAll) {
      const addableItems = targetItems.filter((item) => !isIncluded(selectedItems, item));
      setSelectedItems([...selectedItems, ...addableItems]);
    } else {
      const filteredItems = selectedItems.filter((item) => !isIncluded(targetItems, item));
      setSelectedItems(filteredItems);
    }
  };

  const updateSearch = (values) => {
    reset(values);
    setSearchValues(values);
  };

  /**
   * 검색 조회
   */
  const handleSearch = handleSubmit((values) => {
    updateSearch({ ...values, page: DefaultFormValues.page });
  });

  /**
   * 검색 초기화
   */
  const handleReset = () => {
    updateSearch({ ...DefaultFormValues });
  };

  /**
   * 페이지네이션 변경
   */
  const handleChangePage = (page: number, size: number) => {
    updateSearch({ ...searchValues, page, size });
  };

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [hideLoading, isLoading, showLoading]);

  useEffect(() => {
    // 상품 선택시, id 리스트 업데이트
    setSelectedIds(getSelectedItemIdsInTable(selectedItems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedItems]);

  return {
    formMethod,
    goodsList: data?.content ?? [],
    isLoading,
    pagination: {
      page: searchValues.page,
      limit: searchValues.size,
      total: data?.totalElements || 0,
      onChange: handleChangePage,
    },
    selectedIds,
    selectedItems,
    handleSearch,
    handleReset,
    handleChangeSelect,
    handleChangeSelectAll,
  };
};

/**
 * 배열에 포함되어 있는지 확인
 */
const isIncluded = <T>(items: T[], item: T): boolean => {
  return items.findIndex((v) => isEqual(item, v)) > -1;
};
