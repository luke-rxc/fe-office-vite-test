import React, { useMemo } from 'react';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { Box } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { GoodsTypeLabel, GoodsStatusLabel, GoodsStatusColor } from '../constants';
import { Row, GoodsListItem, GoodsSearchFields } from '../types';
import { Table, Chips, TableThumbnail, TableProps } from './base';

export interface AddableGoodsListProps {
  items: GoodsListItem[];
  selectedIds: GoodsListItem['id'][];
  selectedItems: GoodsListItem[];
  isLoading: boolean;
  total: number;
  page: GoodsSearchFields['page'];
  size: GoodsSearchFields['size'];
  /** 테이블 page 인덱스 변경시 실행할 콜백 */
  onChangePage: (page: number, limit: number) => void;
  /** 테이블 체크박스 선택시 실행할 콜백 */
  onChangeSelect: (id: number, item: GoodsListItem) => void;
  /** 테이블 체크박스 전체 선택/해제시 실행할 콜백 */
  onChangeSelectAll: (selectAll: boolean, ids: number[], items: GoodsListItem[]) => void;
}

/**
 * 추가 가능한 상품 목록 컴포넌트
 */
export const AddableGoodsList: React.FC<AddableGoodsListProps> = ({
  items,
  page = 1,
  total = 0,
  size: limit = 10,
  isLoading,
  selectedIds,
  selectedItems,
  onChangePage: handleChangePage,
  onChangeSelect: handleChangeSelect,
  onChangeSelectAll: handleChangeSelectAll,
}) => {
  /**
   * columns format
   */
  const rowFormat = useMemo<Row<GoodsListItem>>(
    () => [
      {
        label: '상품ID',
        align: 'center',
        dataKey: 'id',
      },
      {
        label: '상품유형',
        align: 'center',
        dataKey: 'type',
        render: (_, { type }) => GoodsTypeLabel[type],
      },
      {
        label: '이미지',
        align: 'center',
        dataKey: 'imageURL',
        render: (imageURL) => <TableThumbnail src={imageURL} />,
      },
      {
        label: '상품명',
        align: 'center',
        dataKey: 'name',
      },
      {
        label: '브랜드',
        align: 'center',
        dataKey: 'brandName',
      },
      {
        label: '입점사',
        align: 'center',
        dataKey: 'providerName',
      },
      {
        label: '정상가',
        align: 'center',
        dataKey: 'consumerPrice',
      },
      {
        label: '판매가',
        align: 'center',
        dataKey: 'price',
      },
      {
        label: '상품 전시 시작일',
        align: 'center',
        dataKey: 'displayStartDate',
      },
      {
        label: '상품 판매 시작일',
        align: 'center',
        dataKey: 'salesStartDate',
      },
      {
        label: '상품 판매 종료일',
        align: 'center',
        dataKey: 'salesEndDate',
      },
      {
        label: '상품상태',
        align: 'center',
        dataKey: 'status',
        render: (_, { status }) => <Label color={GoodsStatusColor[status]} children={GoodsStatusLabel[status]} />,
      },
    ],
    [],
  );

  /**
   * Chip label 렌더 함수
   */
  const getLabel = ({ id, name }: GoodsListItem) => {
    return `${name}(${id})`;
  };

  /**
   * 테이블 Pagination props
   */
  const paginationProps: TableProps<GoodsListItem>['pagination'] = {
    page,
    limit,
    total,
    onChange: handleChangePage,
  };

  /**
   * 테이블 체크박스 Props
   */
  const rowSelectionProps: Extract<TableProps<GoodsListItem>['rowSelection'], object> = {
    selectedRowKeys: selectedIds,
    enableSelectByRowClick: true,
    onChange: (_, items, __, itemId) => {
      if (!!itemId) {
        const id = itemId as unknown as number;
        const item = find(items, (item) => item.id === id);

        handleChangeSelect(id, item);
      } else {
        const isSelectAll = !isEmpty(items);
        const ids = isSelectAll ? items.map(({ id }) => id) : [];

        handleChangeSelectAll(isSelectAll, ids, items);
      }
    },
  };

  return (
    <Box>
      {/* 선택한 상품 아이템 */}
      <Chips<GoodsListItem, 'id'>
        dataKey="id"
        emptyText="선택된 상품이 없습니다"
        items={selectedItems}
        getLabel={getLabel}
        onDelete={handleChangeSelect}
      />
      <br />

      {/* 전시 가능한 상품 테이블 */}
      <Table<GoodsListItem>
        rowKey="id"
        items={items}
        columns={rowFormat}
        isLoading={isLoading}
        pagination={paginationProps}
        rowSelection={rowSelectionProps}
      />
    </Box>
  );
};
