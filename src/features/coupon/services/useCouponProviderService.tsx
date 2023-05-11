import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProviderModel, toProviderModelList } from '../models';
import { TableColumnProps, TableProps } from '@components/table/Table';
import { useQuery } from '@hooks/useQuery';
import { AllowItemType, providerListQueryKey } from '../constants';
import { getProviders } from '../apis';
import { SearchFormField } from '@features/showtime/types';
import { PolicyInfo, CouponFormProps, CouponAllowItem } from '../types';

interface Props {
  policyInfo?: PolicyInfo;
}

interface CouponProviderServiceReturn {
  form: Omit<CouponFormProps<SearchFormField>, 'handleReset'>;
  tableProps: Omit<TableProps<ProviderModel>, 'rowKey'>;
  summaryItems: Array<CouponAllowItem>;
  handleAddSelectItem: () => void;
}

/**
 * useCouponProviderService
 * 쿠폰 입점사 관련 service
 */
export const useCouponProviderService = ({ policyInfo }: Props): CouponProviderServiceReturn => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [keyword, setKeyword] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]);
  const formMethod = useForm<SearchFormField>({
    defaultValues: {
      keyword: '',
    },
  });

  const { handleSubmit } = formMethod;

  const onSubmit = handleSubmit((formValue) => {
    setKeyword(formValue.keyword);
  });

  const columns: Array<TableColumnProps<ProviderModel>> = [
    { label: '입점사ID', dataKey: 'id' },
    { label: '입점사명', dataKey: 'name' },
  ];

  const { data: providerPaginationItem, isLoading } = useQuery(
    [providerListQueryKey, keyword, pageNumber, pageLimit],
    () => {
      return getProviders({
        keyword,
        page: pageNumber,
        size: pageLimit,
      });
    },
    {
      select: (data) => {
        return {
          ...data,
          content: toProviderModelList(data.content),
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
   * 선택된 입점사 item 추가
   */
  const handleAddSelectItem = () => {
    const selectedItems: Array<CouponAllowItem> = providerPaginationItem?.content
      .filter((item) => selectedRowKeys.includes(item.id))
      .map((item) => {
        return { id: item.id, text: item.name };
      });

    const addedKeys = policyInfo.allowProviders.map((item) => item.id);
    policyInfo.handleUpdateAllowItem(AllowItemType.ALLOW_PROVIDER, [
      ...policyInfo.allowProviders,
      ...selectedItems.filter((item) => !addedKeys.includes(item.id)),
    ]);

    setSelectedRowKeys([]);
  };

  const getCheckboxProps = (rowItem: ProviderModel) => {
    return {
      disabled: policyInfo.allowProviders.map((item) => item.id).includes(rowItem.id),
    };
  };

  return {
    form: { formMethod, handleSubmit: onSubmit },
    tableProps: {
      isLoading,
      columns,
      items: providerPaginationItem?.content ?? [],
      rowSelection: {
        selectedRowKeys,
        onChange: handleChangeRowSelect,
        getCheckboxProps,
      },
      pagination: {
        total: providerPaginationItem?.totalElements ?? 0,
        page: pageNumber,
        limit: pageLimit,
        onChange: (page, limit) => {
          pageNumber !== page && setPageNumber(page);
          pageLimit !== limit && setPageLimit(limit);
        },
      },
    },
    summaryItems: policyInfo.allowProviders,
    handleAddSelectItem,
  };
};
