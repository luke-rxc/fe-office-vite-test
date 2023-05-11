import React, { useMemo } from 'react';
import { Box, Button, Chip, Grid, Typography } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { Row, ShowroomListItem } from '../types';
import { ShowroomStatusLabel, ShowroomStatusColor } from '../constants';
import { Table, TableProps } from './base';

export interface SubShowroomListProps {
  isEdit: boolean;
  items: ShowroomListItem[];
  selectedIds: ShowroomListItem['id'][];
  isLoading: boolean;
  /** 추가 버튼 클릭시 실행할 콜백 */
  onAdd: () => void;
  /** 제거 버튼클릭시 실행할 콜백 */
  onRemove: () => void;
  /** 테이블 Row 선택시 실행할 콜백 */
  onChangeSelect: (ids: number[]) => void;
}

/**
 * 소속쇼룸 목록 컴포넌트
 */
export const SubShowroomList: React.FC<SubShowroomListProps> = ({
  isEdit,
  items,
  selectedIds: selectedRowKeys,
  isLoading,
  onAdd: handleAdd,
  onRemove: handleRemove,
  onChangeSelect: handleChangeSelect,
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
   * 테이블 체크박스 Props
   */
  const rowSelectionProps: Extract<TableProps<ShowroomListItem>['rowSelection'], object> = {
    selectedRowKeys,
    enableSelectByRowClick: true,
    onChange: (ids) => handleChangeSelect(ids as number[]),
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6" component="div">
            콘텐츠 편성 쇼룸 (총 {items.length}개)
          </Typography>
          <Typography variant="caption">
            쇼룸을 추가하면 콘텐츠 편성/관리에서 쇼룸 콘텐츠를 불러올 수 있습니다.
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" children="삭제" disabled={!isEdit} onClick={handleRemove} />
          <Button variant="contained" children="추가" disabled={!isEdit} onClick={handleAdd} sx={{ ml: 1 }} />
        </Grid>
      </Grid>

      <Box sx={{ pt: 2 }}>
        <Table<ShowroomListItem>
          rowKey="id"
          maxHeight="400px"
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
