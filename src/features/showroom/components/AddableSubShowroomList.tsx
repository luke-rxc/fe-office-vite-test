import React, { useMemo } from 'react';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { Box, Chip } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { Row, ShowroomListItem, ShowroomSearchFields } from '../types';
import { ShowroomStatusLabel, ShowroomStatusColor, UnAddableSubShowroomStatutes } from '../constants';
import { Table, Chips, TableProps } from './base';

export interface AddableSubShowroomListProps {
  items: ShowroomListItem[];
  selectedIds: ShowroomListItem['id'][];
  selectedItems: ShowroomListItem[];
  isLoading: boolean;
  total: number;
  page: ShowroomSearchFields['page'];
  size: ShowroomSearchFields['size'];
  /** 테이블 page 인덱스 변경시 실행할 콜백 */
  onChangePage: (page: number, limit: number) => void;
  /** 테이블 체크박스 선택시 실행할 콜백 */
  onChangeSelect: (id: number, item: ShowroomListItem) => void;
  /** 테이블 체크박스 전체 선택/해제시 실행할 콜백 */
  onChangeSelectAll: (selectAll: boolean, ids: number[], items: ShowroomListItem[]) => void;
}

/**
 * 추가 가능한 소속쇼룸 목록 컴포넌트
 */
export const AddableSubShowroomList: React.FC<AddableSubShowroomListProps> = ({
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
  const rowFormat = useMemo<Row<ShowroomListItem>>(
    () => [
      {
        label: '쇼룸ID',
        align: 'center',
        dataKey: 'id',
      },
      {
        label: '쇼룸코드',
        align: 'center',
        dataKey: 'code',
      },
      {
        label: '쇼룸명',
        align: 'center',
        dataKey: 'name',
      },
      {
        label: '입점사',
        align: 'center',
        dataKey: 'providerName',
      },
      {
        label: '브랜드',
        align: 'center',
        dataKey: 'brandName',
      },
      {
        label: '키워드',
        align: 'center',
        dataKey: 'keywords',
        render: (_, { keywords = [] }) => {
          return keywords.map((keyword) => (
            <Chip key={keyword} label={keyword} sx={{ m: 1 }} variant="outlined" size="small" />
          ));
        },
      },
      {
        label: '공개 상태',
        align: 'center',
        dataKey: 'status',
        render: (_, { status }) => <Label color={ShowroomStatusColor[status]} children={ShowroomStatusLabel[status]} />,
      },
    ],
    [],
  );

  /**
   * 테이블 Pagination props
   */
  const paginationProps: TableProps<ShowroomListItem>['pagination'] = {
    page,
    limit,
    total,
    onChange: handleChangePage,
  };

  /**
   * 테이블 체크박스 Props
   */
  const rowSelectionProps: Extract<TableProps<ShowroomListItem>['rowSelection'], object> = {
    selectedRowKeys: selectedIds,
    enableSelectByRowClick: true,
    getCheckboxProps: (item) => ({
      disabled: !!UnAddableSubShowroomStatutes[item.status],
    }),
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

  /**
   * Chip label 렌더 함수
   */
  const getLabel = ({ id, name }: ShowroomListItem) => {
    return `${name}(${id})`;
  };

  return (
    <Box>
      {/* 선택한 쇼룸 아이템 */}
      <Chips<ShowroomListItem, 'id'>
        dataKey="id"
        emptyText="선택된 쇼룸이 없습니다"
        items={selectedItems}
        getLabel={getLabel}
        onDelete={handleChangeSelect}
      />
      <br />

      {/* 등록 가능한 쇼룸 테이블 */}
      <Table<ShowroomListItem>
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
