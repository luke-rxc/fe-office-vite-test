import { PaginationProps, Table, TableColumnProps, TableProps } from '@components/table/Table';
import { Box, Card } from '@material-ui/core';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DiscoverSectionItemModel } from '../models';
import { DiscoverSectionTypeChip } from './DiscoverSectionTypeChip';
import { StatusChip } from './StatusChip';

interface Props {
  hideSortNum?: boolean;
  discoverSectionItems: Array<DiscoverSectionItemModel>;
  isLoading: boolean;
  pagination: PaginationProps | false;
  rowSelection?: TableProps<DiscoverSectionItemModel>['rowSelection'];
  linked?: boolean;
}

/**
 * 디스커버 피드 섹션 리스트 component
 */
export const DiscoverFeedSectionList = ({
  hideSortNum = false,
  discoverSectionItems,
  isLoading,
  pagination,
  rowSelection,
  linked = true,
}: Props) => {
  const columns: Array<TableColumnProps<DiscoverSectionItemModel>> = useMemo(
    () => [
      { label: '전시순서', dataKey: 'sortNum', align: 'center', hide: hideSortNum },
      {
        label: '섹션 ID',
        dataKey: 'id',
        align: 'center',
      },
      {
        label: '섹션 타이틀',
        dataKey: 'title',
        align: 'center',
        render: (__, { title, id }) => {
          if (!linked) {
            return title;
          }
          return <Link to={`/display/discover/section/${id}`}>{title}</Link>;
        },
      },
      {
        label: '섹션 타입',
        dataKey: 'sectionTypeText',
        align: 'center',
        render: (__, { sectionType, sectionTypeText }) => {
          return <DiscoverSectionTypeChip className={sectionType.toLowerCase()} label={sectionTypeText} />;
        },
      },
      {
        label: '노출 타입',
        dataKey: 'displayTypeText',
        align: 'center',
      },
      {
        label: '상태',
        dataKey: 'statusText',
        align: 'center',
        render: (_, { openStatusClassName, openStatusText }) => {
          return <StatusChip className={openStatusClassName} label={openStatusText} />;
        },
      },
    ],
    [linked, hideSortNum],
  );

  return (
    <Card
      sx={{
        minHeight: '100%',
        padding: '10px 10px',
        boxShadow: 'none',
      }}
    >
      <Box>
        <Table
          columns={columns}
          items={discoverSectionItems}
          isLoading={isLoading}
          rowKey="rowKey"
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Box>
    </Card>
  );
};
