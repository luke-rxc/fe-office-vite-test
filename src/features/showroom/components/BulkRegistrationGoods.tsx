import isEmpty from 'lodash/isEmpty';
import { useRef, useMemo } from 'react';
import { AddBoxRounded, WarningRounded } from '@material-ui/icons';
import { Button, Chip, Divider, Grid, TextField } from '@material-ui/core';
import { Row, GoodsValidationListItem } from '../types';
import { Table, Typography } from './base';

export interface BulkRegistrationGoodsProps {
  failedItems?: GoodsValidationListItem[];
  successfulItems?: GoodsValidationListItem[];
  onEnter?: (input: HTMLInputElement) => void;
}

/**
 * 상품 일괄 등록을 위한 컴포넌트
 */
export const BulkRegistrationGoods = ({
  failedItems = [],
  successfulItems = [],
  onEnter,
}: BulkRegistrationGoodsProps) => {
  /**
   * input ref
   */
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * columns format
   */
  const rowFormat = useMemo<Row<GoodsValidationListItem>>(
    () => [
      {
        label: '결과',
        align: 'center',
        dataKey: 'success',
        render: () => '실패',
      },
      {
        label: '상품 ID',
        align: 'center',
        dataKey: 'id',
        render: (id) => id,
      },
      {
        label: '실패 사유',
        align: 'center',
        dataKey: 'message',
        render: (message) => message,
      },
    ],
    [],
  );

  /**
   * 유효성 검사 결과에 따른 등록/성공/실패 개수
   */
  const validation = {
    total: failedItems.length + successfulItems.length,
    success: successfulItems.length,
    failure: failedItems.length,
  };

  /**
   * 입력 버튼 클릭시 실행할 이벤트 핸들러
   */
  const handleEnter = () => {
    onEnter?.(inputRef.current);
  };

  return (
    <Grid container spacing={2}>
      {isEmpty(failedItems) && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6" prefix={<AddBoxRounded color="primary" />}>
              상품 ID 입력 후 추가 버튼을 클릭해주세요
            </Typography>
            <Typography variant="subtitle1">
              하나 이상의 상품 ID를 띄어쓰기, 줄바꿈, 콤마(,)로 구분하여 입력해주세요
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              inputRef={inputRef}
              InputProps={{
                endAdornment: (
                  <>
                    <Divider orientation="vertical" sx={{ height: 28, m: 0.5 }} />
                    <Button children="추가" onClick={handleEnter} />
                  </>
                ),
              }}
            />
          </Grid>
        </>
      )}

      {!isEmpty(failedItems) && (
        <>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="secondary"
              sx={{ background: '#ffdede', color: '#f44343', padding: 1 }}
              prefix={<WarningRounded color="secondary" />}
              children="등록 실패한 상품 ID를 확인해주세요"
            />
          </Grid>

          <Grid container item xs={12} spacing={1} justifyContent="flex-end">
            <Grid item children={<Chip color="default" label={`등록 ${validation.total}건`} />} />
            <Grid item children={<Chip color="primary" label={`성공 ${validation.success}건`} />} />
            <Grid item children={<Chip color="secondary" label={`실패 ${validation.failure}건`} />} />
          </Grid>

          <Grid item xs={12}>
            <Table<GoodsValidationListItem> rowKey="id" maxHeight="400px" items={failedItems} columns={rowFormat} />
          </Grid>
        </>
      )}
    </Grid>
  );
};
