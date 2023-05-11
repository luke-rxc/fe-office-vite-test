import { PaginationProps, RowSelectionProps, Table, TableColumnProps } from '@components/table/Table';
import { Card, Box } from '@material-ui/core';
import { ShowroomModel } from '../models';
import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from './StatusChip';
import { ImageViewer } from './ImageViewer';

interface Props {
  items: Array<ShowroomModel>;
  actions?: ReactNode;
  isLoading: boolean;
  pagination?: PaginationProps | false;
  rowSelection?: RowSelectionProps<ShowroomModel>;
}

/**
 * 디스커버 쇼룸 검색 리스트 component
 */
export const DiscoverShowroomSearchList = ({ items, actions, isLoading, pagination = false, rowSelection }: Props) => {
  const columns: Array<TableColumnProps<ShowroomModel>> = useMemo(
    () => [
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
      { label: '쇼룸타입', dataKey: 'typeText', align: 'center' },
      {
        label: '이미지',
        dataKey: 'image',
        align: 'center',
        render: (_, { primaryImage }) => {
          return <ImageViewer fileName={primaryImage.originalFileName} path={primaryImage.fullPath} />;
        },
      },
      { label: '입점사', dataKey: 'providerName', align: 'center' },
      { label: '브랜드', dataKey: 'brandName', align: 'center' },
      {
        label: '최초 생성일 / 최종 수정일',
        dataKey: 'salesStartDateText',
        align: 'center',
        render: (__, { createdDateText, lastUpdatedDateText }) => (
          <>
            <Box>{createdDateText}</Box>
            <Box>{lastUpdatedDateText}</Box>
          </>
        ),
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
    [],
  );

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        padding: '10px 20px',
        boxShadow: 'none',
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
          hideAllSelect
        />
      </Box>
    </Card>
  );
};
