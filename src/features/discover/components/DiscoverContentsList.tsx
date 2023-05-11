import { PaginationProps, RowSelectionProps, Table, TableColumnProps } from '@components/table/Table';
import { Card, Box } from '@material-ui/core';
import { ContentsModel } from '../models';
import { ImageViewer } from './ImageViewer';
import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from './StatusChip';

interface Props {
  showBrand?: boolean;
  hideAllSelect?: boolean;
  hideSortNum?: boolean;
  hideKeywordColumn?: boolean;
  items: Array<ContentsModel>;
  actions?: ReactNode;
  isLoading: boolean;
  pagination?: PaginationProps | false;
  rowSelection?: RowSelectionProps<ContentsModel>;
  stickyHeader?: boolean;
  maxHeight?: string;
}

/**
 * 디스커버 콘텐츠 리스트 component
 */
export const DiscoverContentsList = ({
  showBrand = false,
  hideAllSelect = false,
  hideSortNum = false,
  hideKeywordColumn = true,
  items,
  actions,
  isLoading,
  pagination = false,
  rowSelection,
  stickyHeader = false,
  maxHeight = '650px',
}: Props) => {
  const columns: Array<TableColumnProps<ContentsModel>> = useMemo(
    () => [
      { label: '전시순서', dataKey: 'sortNum', align: 'center', hide: hideSortNum },
      { label: '콘텐츠ID', dataKey: 'id', align: 'center' },
      { label: '콘텐츠유형', dataKey: 'typeText', align: 'center' },
      {
        label: '이미지',
        dataKey: 'image',
        align: 'center',
        render: (_, { primaryImage }) => {
          if (!primaryImage) {
            return null;
          }
          return <ImageViewer fileName={primaryImage.originalFileName} path={primaryImage.fullPath} />;
        },
      },
      {
        label: '콘텐츠명',
        dataKey: 'name',
        align: 'center',
        render: (name, { id }) => {
          return (
            <Link to={`/content/builder/${id}`} target="_blank" rel="noopener">
              {name}
            </Link>
          );
        },
      },
      { label: '입점사', dataKey: 'providerName', align: 'center' },
      {
        label: showBrand ? '쇼룸(브랜드)' : '쇼룸',
        dataKey: 'showRoomName',
        align: 'center',
        render: (__, { brandName, showRoomName }) => {
          if (showBrand) {
            return (
              <>
                <Box>{showRoomName}</Box>
                {brandName && <Box>({brandName})</Box>}
              </>
            );
          }

          return <Box>{showRoomName}</Box>;
        },
      },
      {
        label: '키워드',
        dataKey: 'keywordLabel',
        align: 'center',
        hide: hideKeywordColumn,
      },
      {
        label: '공개 시작일/종료일',
        dataKey: 'publicStartDate',
        align: 'center',
        render: (__, { publicStartDateText, publicEndDateText }) => (
          <>
            <Box>{publicStartDateText}</Box>
            <Box>{publicEndDateText}</Box>
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
    [hideKeywordColumn, hideSortNum, showBrand],
  );

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        padding: '10px 20px',
        ...(hideSortNum ? { boxShadow: 'none' } : null),
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
          hideAllSelect={hideAllSelect}
          stickyHeader={stickyHeader}
          maxHeight={stickyHeader ? maxHeight : undefined}
        />
      </Box>
    </Card>
  );
};
