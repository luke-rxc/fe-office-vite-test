import { TableColumnProps, TableProps } from '@components/table/Table';
import { useQuery } from '@hooks/useQuery';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getGoods } from '../apis';
import { AllowItemType, CouponGoodsSearchType, goodsListQueryKey } from '../constants';
import { GoodsModel, toGoodsModelList } from '../models';
import { PolicyInfo, CouponFormProps, CouponAllowItem, SearchGoodsFormField, SearchGoodsRequestParams } from '../types';

interface Props {
  type: AllowItemType;
  policyInfo?: PolicyInfo;
}

interface CouponGoodsServiceReturn {
  form: Omit<CouponFormProps<SearchGoodsFormField>, 'handleReset'>;
  tableProps: Omit<TableProps<GoodsModel>, 'rowKey'>;
  summaryItems: Array<CouponAllowItem>;
  handleAddSelectItem: () => void;
}

/**
 * useCouponGoodsService
 * 쿠폰의 상품관련 service
 */
export const useCouponGoodsService = ({ type, policyInfo }: Props): CouponGoodsServiceReturn => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [params, setParams] = useState<SearchGoodsRequestParams>({ name: '', goodsIds: [] });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]);
  const formMethod = useForm<SearchGoodsFormField>({
    defaultValues: {
      searchType: CouponGoodsSearchType.NAME,
      value: '',
    },
  });

  const onSubmit = formMethod.handleSubmit(({ searchType, value }) => {
    if (searchType === CouponGoodsSearchType.NAME) {
      setParams({
        name: value,
        goodsIds: [],
      });
    } else {
      setParams({
        name: '',
        goodsIds: value.split(',').map((item) => item.trim()),
      });
    }
  });

  const columns: Array<TableColumnProps<GoodsModel>> = [
    { label: '상품ID', dataKey: 'id' },
    { label: '상품명', dataKey: 'name' },
  ];

  const { data: goodsPaginationItem, isLoading } = useQuery(
    [goodsListQueryKey, params, pageNumber, pageLimit],
    () => {
      return getGoods({
        ...params,
        page: pageNumber,
        size: pageLimit,
      });
    },
    {
      select: (data) => {
        return {
          ...data,
          content: toGoodsModelList(data.content),
        };
      },
    },
  );

  /**
   * row select change
   */
  const handleChangeRowSelect = (selectedRowKeys: Array<number>) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  /**
   * 선택된 상품 item 추가
   */
  const handleAddSelectItem = () => {
    let targetGoods: Array<CouponAllowItem> = null;
    const selectedItems: Array<CouponAllowItem> = goodsPaginationItem?.content
      .filter((item) => selectedRowKeys.includes(item.id))
      .map((item) => {
        return { id: item.id, text: item.name };
      });

    if (type === AllowItemType.ALLOW_GOODS) {
      targetGoods = policyInfo.allowGoods;
    } else if (type === AllowItemType.DENY_GOODS) {
      targetGoods = policyInfo.denyGoods;
    }

    const addedKeys = targetGoods.map((item) => item.id);
    policyInfo.handleUpdateAllowItem(type, [
      ...targetGoods,
      ...selectedItems.filter((item) => !addedKeys.includes(item.id)),
    ]);

    setSelectedRowKeys([]);
  };

  const getCheckboxProps = (rowItem: GoodsModel) => {
    let targetGoods: Array<CouponAllowItem> = null;
    if (type === AllowItemType.ALLOW_GOODS) {
      targetGoods = policyInfo.allowGoods;
    } else if (type === AllowItemType.DENY_GOODS) {
      targetGoods = policyInfo.denyGoods;
    }
    return {
      disabled: targetGoods.map((item) => item.id).includes(rowItem.id),
    };
  };

  return {
    form: { formMethod, handleSubmit: onSubmit },
    tableProps: {
      columns,
      isLoading,
      items: goodsPaginationItem?.content ?? [],
      rowSelection: {
        selectedRowKeys,
        onChange: handleChangeRowSelect,
        getCheckboxProps,
      },
      pagination: {
        total: goodsPaginationItem?.totalElements ?? 0,
        page: pageNumber,
        limit: pageLimit,
        onChange: (page, limit) => {
          pageNumber !== page && setPageNumber(page);
          pageLimit !== limit && setPageLimit(limit);
        },
      },
    },
    summaryItems: type === AllowItemType.ALLOW_GOODS ? policyInfo.allowGoods : policyInfo.denyGoods,
    handleAddSelectItem,
  };
};
