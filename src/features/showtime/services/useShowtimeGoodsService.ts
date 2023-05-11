import { TableColumnProps } from '@components/table/Table';
import { useMutation } from '@hooks/useMutation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getGoods } from '@apis/goods';
import {
  GoodsItem,
  SearchGoodsFormField,
  ShowtimeGoodsModalProps,
  ShowtimeGoodsProps,
  ShowtimeGoodsSearchParams,
} from '../types';
import { GoodsModel, toGoodsItem, toGoodsModelList } from '../models';
import { ShowtimeGoodsSearchType } from '../constants';
import { SortOrderType } from '@constants/table';

interface Props {
  goods: ShowtimeGoodsProps;
  modal: ShowtimeGoodsModalProps;
}

const columns: Array<TableColumnProps<GoodsModel>> = [
  { label: '상품ID', dataKey: 'id', useSort: true },
  { label: '상품명', dataKey: 'name' },
];

const defaultSort = 'id,DESC';

const defaultFormValues: SearchGoodsFormField = { searchType: ShowtimeGoodsSearchType.NAME, value: '' };

export const useShowtimeGoodsService = ({ goods: { addedGoodsItems, handleUpdateGoodsItem }, modal }: Props) => {
  const [goodsItems, setGoodsItems] = useState<Array<GoodsItem>>(addedGoodsItems);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]);
  const [sort, setSort] = useState<string>(defaultSort);
  const formMethod = useForm<SearchGoodsFormField>({ defaultValues: defaultFormValues });
  const { handleSubmit, reset, getValues } = formMethod;

  const [sortKey, sortType] = sort.split(',');

  /**
   * 쇼타임 상품검색 param 리턴
   */
  const getShowtimeGoodsParams = useCallback(
    ({ searchType, value }: SearchGoodsFormField): ShowtimeGoodsSearchParams => {
      if (searchType === ShowtimeGoodsSearchType.NAME) {
        return {
          name: value,
          goodsIds: [],
        };
      } else {
        return {
          name: '',
          goodsIds: value.split(',').map((item) => item.trim()),
        };
      }
    },
    [],
  );

  const {
    data: goodsPaginationItem,
    mutateAsync: getGoodsList,
    isLoading,
  } = useMutation((params: ShowtimeGoodsSearchParams) => {
    return getGoods({
      ...params,
      sort: sort,
      page: pageNumber,
      size: pageLimit,
    });
  });

  useEffect(() => {
    if (modal.showModal) {
      getGoodsList(getShowtimeGoodsParams(getValues()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.showModal, pageNumber, pageLimit, getGoodsList, getShowtimeGoodsParams]);

  useEffect(() => {
    if (modal.showModal) {
      getGoodsList(getShowtimeGoodsParams(getValues()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    if (modal.showModal) {
      setGoodsItems(addedGoodsItems);
    }

    return () => {
      setSort(defaultSort);
      setGoodsItems([]);
      reset(defaultFormValues);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal.showModal]);

  /**
   * 페이지수 변경
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<number>) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**
   * 선택 item 추가
   */
  const handleAddSelectItem = () => {
    const selectedItems: Array<GoodsItem> = toGoodsModelList(goodsPaginationItem?.content)
      .filter((item) => selectedRowKeys.includes(item.id))
      .map(toGoodsItem);

    const addedKeys = goodsItems.map((item) => item.id);
    setGoodsItems([...goodsItems, ...selectedItems.filter((item) => !addedKeys.includes(item.id))]);
    setSelectedRowKeys([]);
  };

  /**
   * 선택 item 제거
   */
  const handleRemoveSelectItem = (id: number) => {
    setGoodsItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * table checkbox props
   */
  const getCheckboxProps = (rowItem: GoodsModel) => {
    return {
      disabled: goodsItems.map((item) => item.id).includes(rowItem.id),
    };
  };

  /**
   * modal close시 처리
   */
  const handleCloseAddGoods = () => {
    setGoodsItems([]);
    reset(defaultFormValues);
    modal.handleCloseModal();
  };

  /**
   * modal confirm시 처리
   */
  const handleConfirmAddGoods = () => {
    goodsItems.length > 0 && handleUpdateGoodsItem(goodsItems);
    handleCloseAddGoods();
  };

  /**
   * 검색버튼 클릭 (submit)
   */
  const onSubmit = handleSubmit((values) => {
    setSelectedRowKeys([]);
    setPageNumber(1);
    getGoodsList(getShowtimeGoodsParams(values));
  });

  /**
   * table page 수정
   */
  const handleChangePage = (page, limit) => {
    pageNumber !== page && setPageNumber(page);
    pageLimit !== limit && setPageLimit(limit);
  };

  /**
   * table sort
   */
  const handleSort = (orderKey: string, orderType: SortOrderType) => {
    if (modal.showModal) {
      setSort(`${orderKey},${orderType.toUpperCase()}`);
    }
  };

  return {
    form: { formMethod, handleSubmit: onSubmit },
    tableProps: {
      columns,
      isLoading,
      items: goodsPaginationItem ? toGoodsModelList(goodsPaginationItem.content) : [],
      rowSelection: {
        selectedRowKeys,
        onChange: handleChangeRowSelect,
        getCheckboxProps,
      },
      pagination: {
        total: goodsPaginationItem?.totalElements ?? 0,
        page: pageNumber,
        limit: pageLimit,
        onChange: handleChangePage,
      },
      sort: {
        orderKey: sortKey,
        orderType: sortType.toLowerCase() as SortOrderType,
        handleSort,
      },
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
    summaryItems: goodsItems,
    handleAddSelectItem,
    handleConfirmAddGoods,
    handleCloseAddGoods,
    handleRemoveSelectItem,
  };
};
