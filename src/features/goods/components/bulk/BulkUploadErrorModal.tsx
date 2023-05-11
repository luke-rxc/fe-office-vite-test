import React from 'react';
import styled from '@emotion/styled';
import { Typography, Box, Button, Grid } from '@material-ui/core';
import { Table, TableColumnProps } from '@components/table/Table';
import { Modal } from '@components/Modal';
import { BulkType, BulkTypeLabel } from '../../constants';

export interface BulkExportErrorListModel {
  id: string;
  goodsId: string;
  optionId?: string;
  reason: string;
}

export interface BulkUploadErrorModalProps {
  isOpen: boolean;
  list: BulkExportErrorListModel[];
  total: number;
  bulkType: BulkType;
  onCloseModal: () => void;
}

export const BulkUploadErrorModal: React.FC<BulkUploadErrorModalProps> = ({
  isOpen,
  list,
  total,
  bulkType,
  onCloseModal: handleCloseModal,
}) => {
  const tableColumns: Array<TableColumnProps<Record<string, any>>> = [
    {
      label: '상품 ID',
      dataKey: 'goodsId',
      align: 'center',
    },
    {
      label: '옵션 ID',
      dataKey: 'optionId',
      align: 'center',
      hide: bulkType !== BulkType.OPTION,
    },
    {
      label: '실패 사유',
      dataKey: 'reason',
      align: 'center',
    },
  ];
  return (
    <Modal
      open={isOpen}
      title={`${BulkTypeLabel[bulkType]} 등록 실패`}
      width="100%"
      minWidth="900px"
      onClose={handleCloseModal}
    >
      <GridWrapperStyled container spacing={2}>
        <Grid item md={12} xs={12} display="flex" justifyContent="flex-end">
          <ErrorCountStyled>실패 {total}건</ErrorCountStyled>
        </Grid>
        <Grid item md={12} xs={12}>
          <Table columns={tableColumns} items={list} rowKey="id" pagination={false} />
        </Grid>
        <Grid item md={12} xs={12}>
          {/* gray typography */}
          <Typography variant="body2" color="textSecondary">
            * 실패 사유는 최대 20개까지 보여집니다. 파일을 다시 확인해주세요
          </Typography>
        </Grid>
      </GridWrapperStyled>
      <Box p={2} display="flex" justifyContent="center" alignContent="center">
        <Button size="large" type="submit" color="primary" variant="contained" onClick={handleCloseModal}>
          확인
        </Button>
      </Box>
    </Modal>
  );
};

const GridWrapperStyled = styled(Grid)`
  padding: 24px 0;
`;

const ErrorCountStyled = styled.div`
  background: #f50057;
  color: #fff;
  padding: 6px 16px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.75;
  box-sizing: border-box;
`;
