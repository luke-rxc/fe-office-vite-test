import { PaginationProps, RowSelectionProps, Table, TableColumnProps } from '@components/table/Table';
import { Card, Box } from '@material-ui/core';
import { GoodsModel } from '../models';
import { ReactNode, useMemo } from 'react';
import { ImageViewer } from './ImageViewer';
import { Link } from 'react-router-dom';
import { StatusChip } from './StatusChip';

interface Props {
  showShowroom?: boolean;
  hideAllSelect?: boolean;
  hideKeywordColumn?: boolean;
  hideSortNum?: boolean;
  hideDisplayStatus?: boolean;
  items: Array<GoodsModel>;
  actions?: ReactNode;
  isLoading: boolean;
  pagination?: PaginationProps | false;
  rowSelection?: RowSelectionProps<GoodsModel>;
  stickyHeader?: boolean;
  maxHeight?: string;
}

/**
 * 디스커버 상품 리스트 component
 */
export const DiscoverGoodsList = ({
  showShowroom = false,
  hideAllSelect = false,
  hideKeywordColumn = true,
  hideSortNum = false,
  hideDisplayStatus = false,
  items,
  actions,
  isLoading,
  pagination = false,
  rowSelection,
  stickyHeader = false,
  maxHeight = '650px',
}: Props) => {
  const columns: Array<TableColumnProps<GoodsModel>> = useMemo(
    () => [
      { label: '전시순서', dataKey: 'sortNum', align: 'center', hide: hideSortNum },
      { label: '상품ID', dataKey: 'goodsId', align: 'center' },
      { label: '상품유형', dataKey: 'goodsType', align: 'center' },
      {
        label: '이미지',
        dataKey: 'image',
        align: 'center',
        render: (_, { goodsImage }) => {
          return <ImageViewer fileName={goodsImage.originalFileName} path={goodsImage.fullPath} />;
        },
      },
      {
        label: '상품명',
        dataKey: 'goodsName',
        align: 'center',
        render: (goodsName, { goodsId }) => {
          return (
            <Link to={`/goods/${goodsId}`} target="_blank" rel="noopener">
              {goodsName}
            </Link>
          );
        },
      },
      { label: '입점사', dataKey: 'providerName', align: 'center' },
      {
        label: showShowroom ? '쇼룸(브랜드)' : '브랜드',
        dataKey: 'brandName',
        align: 'center',
        render: (__, { brandName, showRoomName }) => {
          if (showShowroom) {
            return (
              <>
                <Box>{showRoomName}</Box>
                {brandName && <Box>({brandName})</Box>}
              </>
            );
          }

          return <Box>{brandName}</Box>;
        },
      },
      {
        label: '정상가/판매가',
        dataKey: 'price',
        align: 'center',
        render: (__, { consumerPriceText, priceText }) => (
          <>
            <Box>{consumerPriceText}원</Box>
            <Box>{priceText}원</Box>
          </>
        ),
      },
      {
        label: '키워드',
        dataKey: 'keywordLabel',
        align: 'center',
        hide: hideKeywordColumn,
      },
      {
        label: '판매 시작일/종료일',
        dataKey: 'salesStartDateText',
        align: 'center',
        render: (__, { salesStartDateText, salesEndDateText }) => (
          <>
            <Box>{salesStartDateText}</Box>
            <Box>{salesEndDateText}</Box>
          </>
        ),
      },
      {
        label: '상태',
        dataKey: 'salesStatusText',
        align: 'center',
        render: (_, { salesStatusClassName, salesStatusText }) => {
          return <StatusChip className={salesStatusClassName} label={salesStatusText} />;
        },
      },
      {
        label: '서비스 노출 상태',
        dataKey: 'displayStatusText',
        align: 'center',
        render: (_, { displayStatus, displayStatusClassName, displayStatusText }) => {
          return displayStatus ? <StatusChip className={displayStatusClassName} label={displayStatusText} /> : '';
        },
        hide: hideDisplayStatus,
      },
    ],
    [hideKeywordColumn, hideSortNum, hideDisplayStatus, showShowroom],
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
