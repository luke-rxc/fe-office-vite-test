import { PaginationProps, RowSelectionProps, Table, TableColumnProps } from '@components/table/Table';
import { Card, Box } from '@material-ui/core';
import { ShowroomModel } from '../models';
import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from './StatusChip';

interface Props {
  hideKeywordColumn?: boolean;
  items: Array<ShowroomModel>;
  actions?: ReactNode;
  isLoading: boolean;
  pagination?: PaginationProps | false;
  rowSelection?: RowSelectionProps<ShowroomModel>;
  stickyHeader?: boolean;
  maxHeight?: string;
}

/**
 * 디스커버 쇼룸 리스트 component
 */
export const DiscoverShowroomList = ({
  hideKeywordColumn = true,
  items,
  actions,
  isLoading,
  pagination = false,
  rowSelection,
  stickyHeader = false,
  maxHeight = '650px',
}: Props) => {
  const columns: Array<TableColumnProps<ShowroomModel>> = useMemo(
    () => [
      { label: '전시순서', dataKey: 'sortNum', align: 'center' },
      { label: '쇼룸ID', dataKey: 'id', align: 'center' },
      { label: '쇼룸코드', dataKey: 'code', align: 'center' },
      {
        label: '쇼룸명',
        dataKey: 'name',
        align: 'center',
        render: (name, { id }) => {
          return (
            <Link to={`/showroom/${id}`} target="_blank" rel="noopener">
              {name}
            </Link>
          );
        },
      },
      { label: '브랜드', dataKey: 'brandName', align: 'center' },
      { label: '입점사', dataKey: 'providerName', align: 'center' },
      {
        label: '키워드',
        dataKey: 'keywordLabel',
        align: 'center',
        hide: hideKeywordColumn,
      },
      {
        label: '상태',
        dataKey: 'statusText',
        align: 'center',
        render: (_, { statusClassName, statusText }) => {
          return <StatusChip className={statusClassName} label={statusText} />;
        },
      },
    ],
    [hideKeywordColumn],
  );

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        padding: '10px 20px',
      }}
    >
      {actions}
      <Box>
        <Table
          columns={columns}
          items={items}
          rowKey="rowKey"
          isLoading={isLoading}
          pagination={pagination}
          rowSelection={rowSelection}
          stickyHeader={stickyHeader}
          maxHeight={stickyHeader ? maxHeight : undefined}
        />
      </Box>
    </Card>
  );
};
