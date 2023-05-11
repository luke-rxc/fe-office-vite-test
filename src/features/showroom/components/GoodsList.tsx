import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Info } from '@material-ui/icons/';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { GoodsTypeLabel, GoodsStatusLabel, GoodsStatusColor } from '../constants';
import { Row, GoodsListItem } from '../types';
import { OrderController, Table, TableThumbnail, Tooltip, TableProps } from './base';

export interface GoodsListListProps {
  isEdit: boolean;
  isConcept: boolean;
  items: GoodsListItem[];
  selectedIds: GoodsListItem['id'][];
  isLoading: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onBulkAdd: () => void;
  onToTop: () => void;
  onToBottom: () => void;
  onToForward: () => void;
  onToBackward: () => void;
  onChangeSelect: (ids: number[]) => void;
}

/**
 * 상품 목록 컴포넌트
 */

export const GoodsList: React.FC<GoodsListListProps> = ({
  isEdit,
  isConcept,
  items = [],
  selectedIds: selectedRowKeys,
  isLoading,
  onAdd: handleAdd,
  onRemove: handleRemove,
  onBulkAdd: handleBulkAdd,
  onChangeSelect: handleChangeSelect,
  onToTop: handleToTop,
  onToBottom: handleToBottom,
  onToForward: handleToForward,
  onToBackward: handleToBackward,
}) => {
  /**
   * columns format
   */
  const rowFormat = useMemo<Row<GoodsListItem>>(
    () => [
      {
        label: '전시순서',
        align: 'center',
        dataKey: 'order',
        render: (_, __, index) => index + 1,
      },
      {
        label: '상품유형',
        align: 'center',
        dataKey: 'type',
        render: (_, { type }) => GoodsTypeLabel[type],
      },
      {
        label: '상품 ID',
        align: 'center',
        dataKey: 'id',
        render: (_, { id }) => <Link target="_blank" to={`/goods/${id}`} children={id} />,
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
   * 테이블 체크박스 Props
   */
  const rowSelectionProps: Extract<TableProps<GoodsListItem>['rowSelection'], object> = {
    selectedRowKeys,
    enableSelectByRowClick: true,
    onChange: (ids) => handleChangeSelect(ids as number[]),
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        {/* 타이틀 및 Description */}
        <Grid item>
          <Typography variant="h6" component="div">
            전시상품 (총 {items.length}개)
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="caption">
              {isConcept
                ? '섹션 내 전시할 상품을 검색 및 추가해주세요.'
                : '쇼룸 화면에 전시할 상품을 검색하고 등록 하세요.'}
            </Typography>
            <Tooltip title="판매예정, 판매중 상태의 상품만 실제 서비스에 노출이 가능합니다.">
              <Info fontSize="small" color="disabled" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
        </Grid>

        {/* 액션 버튼들 */}
        <Grid item>
          <OrderController
            disabled={!isEdit}
            onTop={handleToTop}
            onBottom={handleToBottom}
            onForward={handleToForward}
            onBackward={handleToBackward}
          />
          <Button
            variant="contained"
            color="secondary"
            children="삭제"
            disabled={!isEdit}
            onClick={handleRemove}
            sx={{ ml: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            children="추가"
            disabled={!isEdit}
            onClick={handleAdd}
            sx={{ ml: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            children="일괄 등록"
            disabled={!isEdit}
            onClick={handleBulkAdd}
            sx={{ ml: 1 }}
          />
        </Grid>
      </Grid>

      {/* 전시상품 목록 */}
      <Box sx={{ pt: 2 }}>
        <Table<GoodsListItem>
          rowKey="id"
          maxHeight="980px"
          emptyHeight="200px"
          items={items}
          pagination={false}
          columns={rowFormat}
          isLoading={isLoading}
          hideAllSelect={!isEdit}
          rowSelection={isEdit && rowSelectionProps}
        />
      </Box>
    </Box>
  );
};
