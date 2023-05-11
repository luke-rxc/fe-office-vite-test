import React, { useMemo } from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { KeyboardArrowUp } from '@material-ui/icons';
import { Row, ContentListItem } from '../types';
import { ContentStatusLabel, ContentStatusColor, UnAddableContentStatutes } from '../constants';
import { Table, TableThumbnail, TableProps } from './base';

export interface AddableContentListProps {
  items: ContentListItem[];
  selectedIds: number[];
  isEdit: boolean;
  isLoading: boolean;
  /** 편성추가 버튼 클릭 콜백 */
  onAdd: () => void;
  /** 테이블 체크박스 선택시 실행할 콜백 */
  onChangeSelect: (ids: number[]) => void;
}

/**
 * 추가 가능한 콘텐츠 목록 컴포넌트
 */
export const AddableContentList: React.FC<AddableContentListProps> = ({
  items,
  selectedIds,
  isEdit,
  isLoading,
  onAdd: handleAdd,
  onChangeSelect: handleChangeSelect,
}) => {
  /**
   * columns format
   */
  const rowFormat = useMemo<Row<ContentListItem>>(
    () => [
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
    getCheckboxProps: (item) => ({
      disabled: !!UnAddableContentStatutes[item.status],
    }),
    onChange: (ids) => handleChangeSelect(ids as number[]),
  };

  return (
    <Box sx={{ pt: 1 }}>
      {/* 미편성 콘텐츠 세션 정보 및 액션 */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6" component="div">
            미편성 콘텐츠 (총 {items.length}개)
          </Typography>
          <Typography variant="caption">편성 가능 콘텐츠를 편성하여 쇼룸에 공개 하세요.</Typography>
        </Grid>
        <Grid item>
          <Button
            disabled={!isEdit}
            variant="contained"
            children="편성추가"
            startIcon={<KeyboardArrowUp />}
            onClick={handleAdd}
          />
        </Grid>
      </Grid>

      {/* 미편성 콘텐츠 테이블 */}
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
