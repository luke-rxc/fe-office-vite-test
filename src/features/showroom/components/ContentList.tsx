import React, { useMemo } from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { KeyboardArrowDown } from '@material-ui/icons';
import { Row, ContentListItem } from '../types';
import { ContentStatusLabel, ContentStatusColor } from '../constants';
import { Table, TableProps, TableThumbnail, OrderController } from './base';

export interface ContentListProps {
  items: ContentListItem[];
  selectedIds: number[];
  isEdit: boolean;
  isLoading: boolean;
  onToTop: () => void;
  onToBottom: () => void;
  onToForward: () => void;
  onToBackward: () => void;
  onRemove: () => void;
  onChangeSelect: (ids: number[]) => void;
}

/**
 * 콘텐츠 목록 컴포넌트
 */
export const ContentList: React.FC<ContentListProps> = ({
  items,
  selectedIds,
  isEdit,
  isLoading,
  onRemove: handleRemove,
  onChangeSelect: handleChangeSelect,
  onToTop: handleToTop,
  onToBottom: handleToBottom,
  onToForward: handleToForward,
  onToBackward: handleToBackward,
}) => {
  /**
   * columns format
   */
  const rowFormat = useMemo<Row<ContentListItem>>(
    () => [
      {
        label: '전시순서',
        align: 'center',
        dataKey: 'order',
        render: (_, __, index) => index + 1,
      },
      {
        label: '쇼룸명',
        align: 'center',
        dataKey: 'showroomName',
      },
      {
        label: '입점사',
        align: 'center',
        dataKey: 'providerName',
      },
      {
        label: '콘텐츠ID',
        align: 'center',
        dataKey: 'id',
      },
      {
        label: '콘텐츠 타입',
        align: 'center',
        dataKey: 'type',
      },
      {
        label: '이미지',
        align: 'center',
        dataKey: 'imageURL',
        render: (imageURL) => <TableThumbnail src={imageURL} />,
      },
      {
        label: '콘텐츠 타이틀',
        align: 'center',
        dataKey: 'name',
      },
      {
        label: '공개 시작일',
        align: 'center',
        dataKey: 'startDate',
      },
      {
        label: '공개 종료일',
        align: 'center',
        dataKey: 'endDate',
      },
      {
        label: '공개 상태',
        align: 'center',
        dataKey: 'status',
        render: (_, { status }) => <Label color={ContentStatusColor[status]} children={ContentStatusLabel[status]} />,
      },
    ],
    [],
  );

  /**
   * 테이블 체크박스 Props
   */
  const rowSelectionProps: Extract<TableProps<ContentListItem>['rowSelection'], object> = {
    selectedRowKeys: selectedIds,
    enableSelectByRowClick: true,
    onChange: (ids) => handleChangeSelect(ids as number[]),
  };

  return (
    <Box sx={{ pt: 1 }}>
      {/* 편성 콘텐츠 세션 정보 및 액션 */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6" component="div">
            편성 콘텐츠 (총 {items.length}개)
          </Typography>
          <Typography variant="caption">
            쇼룸 화면에 공개 될 콘텐츠를 편성하고 전시순서를 관리 하세요. (‘공개 예정’ 콘텐츠도 편성 가능)
          </Typography>
        </Grid>
        <Grid item>
          <OrderController
            disabled={!isEdit}
            onTop={handleToTop}
            onBottom={handleToBottom}
            onForward={handleToForward}
            onBackward={handleToBackward}
          />

          <Button
            disabled={!isEdit}
            color="secondary"
            variant="contained"
            children="편성제외"
            startIcon={<KeyboardArrowDown />}
            onClick={handleRemove}
            sx={{ ml: 2 }}
          />
        </Grid>
      </Grid>

      {/* 편성 콘텐츠 테이블 */}
      <Box sx={{ pt: 2 }}>
        <Table<ContentListItem>
          rowKey="id"
          maxHeight="686px"
          emptyHeight="200px"
          items={items}
          columns={rowFormat}
          isLoading={isLoading}
          pagination={false}
          hideAllSelect={!isEdit}
          rowSelection={isEdit && rowSelectionProps}
        />
      </Box>
    </Box>
  );
};
