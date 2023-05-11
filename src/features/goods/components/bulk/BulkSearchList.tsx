import React from 'react';
import { Card, Box, CardHeader, Link, Typography, Button, Tooltip, Grid } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { PaginationProps, Table, TableColumnProps, TableProps } from '@components/table/Table';
import UploadIcon from '@assets/icons/Upload';
import XIcon from '@assets/icons/X';
import { BulkListModel } from '../../models';

interface Props {
  isLoading: boolean;
  searchLists: BulkListModel[];
  pagination: PaginationProps;
  rowSelection?: TableProps<unknown>['rowSelection'];
  onCancelList: () => void;
  onOpenUploadModal: () => void;
}

/** 대기(isStandBy) 상태일때, 강조 텍스트 */
const EmphasizeStandbyTypography: React.FC<{ value: string; isStandBy: boolean }> = ({ value, isStandBy }) => {
  const colorValue = isStandBy ? 'primary' : '';
  const fontWeightValue = isStandBy ? 'bold' : '';

  return (
    <Typography variant="body2" color={colorValue} fontWeight={fontWeightValue}>
      {value}
    </Typography>
  );
};

const tableColumns: Array<TableColumnProps<BulkListModel>> = [
  {
    label: '수정번호',
    dataKey: 'id',
    align: 'center',
    render: (value) => {
      return <Link href={`/bulk/${value}`}>{value}</Link>;
    },
  },
  {
    label: '분류',
    dataKey: 'typeText',
    align: 'center',
  },
  {
    label: '처리 사유',
    dataKey: 'title',
    align: 'center',
  },
  {
    label: '상품수',
    dataKey: 'goodsCnt',
    align: 'center',
  },
  {
    label: '작업자',
    dataKey: 'adminUserName',
    align: 'center',
  },
  {
    label: '상태',
    dataKey: 'statusText',
    align: 'center',
    render: (value, items) => <EmphasizeStandbyTypography value={value} isStandBy={items.isStandBy} />,
  },
  {
    label: '반영 일시',
    dataKey: 'resultDate',
    align: 'center',
    render: (value, items) => <EmphasizeStandbyTypography value={value} isStandBy={items.isStandBy} />,
  },
  {
    label: '등록 일시',
    dataKey: 'createdDate',
    align: 'center',
  },
];

export const BulkSearchList: React.FC<Props> = ({
  isLoading,
  searchLists,
  pagination,
  rowSelection,
  onCancelList: handleCancelList,
  onOpenUploadModal: handleOpenUploadModal,
}) => {
  const { selectedRowKeys } = rowSelection || {};
  const isCancelBtnDisabled = !selectedRowKeys || selectedRowKeys.length === 0;

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
      }}
    >
      <CardHeader
        action={
          <Grid container alignItems="center">
            <Button
              size="medium"
              variant="outlined"
              onClick={handleOpenUploadModal}
              startIcon={<UploadIcon fontSize="small" />}
            >
              엑셀 서식 등록
            </Button>
            <Button
              size="medium"
              variant="outlined"
              onClick={handleCancelList}
              startIcon={<XIcon fontSize="small" />}
              disabled={isCancelBtnDisabled}
              sx={{ ml: 1 }}
            >
              예약 취소
              <Tooltip
                title={<Typography variant="body2">대기상태에서만 예약취소가 가능합니다.</Typography>}
                children={<HelpIcon fontSize="small" />}
                placement="top"
              />
            </Button>
          </Grid>
        }
      />
      <Box>
        <Table
          columns={tableColumns}
          items={searchLists}
          rowKey="id"
          isLoading={isLoading}
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Box>
    </Card>
  );
};
