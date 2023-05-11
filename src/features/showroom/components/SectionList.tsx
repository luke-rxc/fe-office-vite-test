import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Switch } from '@material-ui/core';
import { default as Label } from '@components/Label';
import { Row, SectionListItem } from '../types';
import { SectionStatusValue, SectionStatusLabel, SectionStatusColor } from '../constants';
import { Table, Typography, TableProps } from './base';

/**
 *
 */
export interface SectionListProps {
  items: SectionListItem[];
  selectedIds: SectionListItem['id'][];
  page: number;
  size: number;
  total: number;
  isLoading: boolean;
  onDelete: () => void;
  onChangePage: (page: number, size: number) => void;
  onChangeSelect: (ids: number) => void;
  onChangeStatus: (item: SectionListItem) => void;
}

/**
 *
 */
export const SectionList = ({
  items,
  selectedIds,
  page,
  size,
  total,
  isLoading,
  onDelete: handleDelete,
  onChangePage: handleChangePage,
  onChangeSelect: handleChangeSelect,
  onChangeStatus: handleChangeStatus,
}) => {
  /**
   * columns format
   */
  const rowFormat = useMemo<Row<SectionListItem>>(
    () => [
      {
        label: '정렬 순서',
        align: 'center',
        dataKey: 'order',
        render: (_, __, index) => index + 1 + (page - 1) * size,
      },
      {
        label: '섹션 ID',
        align: 'center',
        dataKey: 'id',
      },
      {
        label: '섹션 제목',
        align: 'center',
        dataKey: 'title',
        render: (_, { id, title }) => <Link to={`section/${id}`} children={title} />,
      },
      {
        label: '최초 생성일',
        align: 'center',
        dataKey: 'createdDate',
      },
      {
        label: '최종 수정일',
        align: 'center',
        dataKey: 'updatedDate',
      },
      {
        label: '공개 상태',
        align: 'center',
        dataKey: 'status',
        render: (_, { status }) => <Label color={SectionStatusColor[status]} children={SectionStatusLabel[status]} />,
      },
      {
        label: '공개 설정',
        align: 'center',
        dataKey: 'contentCount',
        render: (_, item, index) => (
          <Switch value={item.id} checked={SectionStatusValue[item.status]} onChange={() => handleChangeStatus(item)} />
        ),
      },
    ],
    [page, size, handleChangeStatus],
  );

  /**
   *
   */
  const paginationProps = {
    page,
    total,
    limit: size,
    onChange: handleChangePage,
  };

  /**
   * 테이블 체크박스 Props
   */
  const rowSelectionProps: Extract<TableProps<SectionListItem>['rowSelection'], object> = {
    selectedRowKeys: selectedIds,
    onChange: (ids) => handleChangeSelect(ids as number[]),
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        {/* 타이틀 및 Description */}
        <Grid item>
          <Typography block variant="h6">
            전시섹션 (총 {total}개)
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="caption">편집 상태에서 섹션별 전시 상품을 검색 및 추가할 수 있습니다.</Typography>
          </Box>
        </Grid>

        {/* 액션 버튼들 */}
        <Grid item>
          <Button variant="contained" color="secondary" children="삭제" sx={{ ml: 2 }} onClick={handleDelete} />
          <Button component={Link} variant="contained" color="primary" children="추가" to={'section'} sx={{ ml: 1 }} />
        </Grid>
      </Grid>

      {/* 전시 섹션 목록 */}
      <Box sx={{ pt: 2 }}>
        <Table<SectionListItem>
          rowKey="id"
          maxHeight="980px"
          emptyHeight="200px"
          items={items}
          columns={rowFormat}
          isLoading={isLoading}
          pagination={paginationProps}
          rowSelection={rowSelectionProps}
        />
      </Box>
    </Box>
  );
};
