import { PaginationProps, Table, TableColumnProps } from '@components/table/Table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from '.';
import { DiscoverKeywordItemModel } from '../models/DiscoverKeywordModel';

interface Props {
  items: Array<DiscoverKeywordItemModel>;
  isLoading: boolean;
  pagination?: PaginationProps | false;
}

/**
 * 디스커버 키워드 리스트 component
 */
export const DiscoverKeywordList = ({ items, isLoading, pagination = false }: Props) => {
  const columns: Array<TableColumnProps<DiscoverKeywordItemModel>> = useMemo(
    () => [
      { label: '키워드 ID', dataKey: 'id', align: 'center' },
      {
        label: '키워드 타이틀',
        dataKey: 'name',
        align: 'center',
        render: (name, { id }) => {
          return <Link to={`/display/discover/keyword/${id}`}>{name}</Link>;
        },
      },
      { label: '맵핑 대상', dataKey: 'mappingTarget', align: 'center' },
      { label: '최초생성일', dataKey: 'createdDateText', align: 'center' },
      { label: '최종수정일', dataKey: 'updatedDateText', align: 'center' },

      {
        label: '상태',
        dataKey: 'statusText',
        align: 'center',
        render: (value, { status }) => {
          return <StatusChip className={status.toLowerCase()} label={value} />;
        },
      },
    ],
    [],
  );

  return <Table columns={columns} items={items} rowKey="rowKey" isLoading={isLoading} pagination={pagination} />;
};
