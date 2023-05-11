import { Table, TableColumnProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { OrderRequestRefundableItemOptionModel } from '@features/order/models';
import { ReturnTypeOrderRequestRefundService } from '@features/order/services';
import { OrderRequestRefundFormField } from '@features/order/types';
import { Box, Button, Chip, Grid } from '@material-ui/core';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControlRadioGroup, FormControlSelect, FormControlTextField } from '@components/form';

interface Props {
  refundItemOption: ReturnTypeOrderRequestRefundService['refundItemOption'];
  refundReasonItems: ReturnTypeOrderRequestRefundService['refundReasonItems'];
  rowSelection: ReturnTypeOrderRequestRefundService['rowSelection'];
  onClickSelectShippingGroupGoodsOption: ReturnTypeOrderRequestRefundService['handleClickSelectShippingGroupGoodsOption'];
}

export const OrderRequestRefund = ({
  refundItemOption: { isFullRefundable, refundableItemOptionList },
  refundReasonItems,
  rowSelection,
  onClickSelectShippingGroupGoodsOption: handleClickSelectShippingGroupGoodsOption,
}: Props) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<OrderRequestRefundFormField>();
  const cancelReasonCode = watch('reasonCode');
  const selectedOptionError = errors['selectedOption'];

  const columns: Array<TableColumnProps<OrderRequestRefundableItemOptionModel>> = useMemo(() => {
    return [
      {
        label: '입점사',
        dataKey: 'provider.name',
        align: 'center',
        rowSpan: (item) => item.providerRowspan,
      },
      {
        label: '배송그룹선택',
        dataKey: 'shipping',
        align: 'center',
        render: (value, item) => {
          if (rowSelection !== undefined) {
            return (
              <Button
                type="button"
                variant="contained"
                size="small"
                onClick={handleClickSelectShippingGroupGoodsOption(item.shipping.id)}
              >
                전체옵션선택
              </Button>
            );
          }

          return '';
        },
        hide: rowSelection === undefined,
        rowSpan: (item) => item.shippingRowspan,
      },
      { label: '배송그룹번호', dataKey: 'shipping.id', align: 'center' },
      {
        label: '상품타입',
        dataKey: 'goods.type.name',
        align: 'center',
        render: (value, item) => {
          return <Chip label={value} color={item.goods.type.code === 'auction' ? 'secondary' : 'default'} />;
        },
      },
      {
        label: '상품명',
        dataKey: 'goods.name',
        align: 'center',
        render: (value, item) => {
          return (
            <Box display="flex" flexDirection="column" justifyContent="flexStart">
              <Box textAlign="left">{value}</Box>
              {item.goods.option.optionLabel && <Box textAlign="left">(옵션) {item.goods.option.optionLabel}</Box>}
              {item.packageOption && <Box textAlign="left">(패키지 옵션) {item.packageOption.optionLabel}</Box>}
            </Box>
          );
        },
      },
      { label: '주문수량', dataKey: 'ea', align: 'center' },
      {
        label: '취소가능수량',
        dataKey: 'refundableEa',
        align: 'center',
        width: '180px',
        render: (value, item, index) => {
          if (rowSelection?.selectedRowKeys.includes(item.key)) {
            return (
              <Box display="flex" alignItems="center" justifyContent="center">
                <FormControlTextField
                  name={`ea.${index}`}
                  size="small"
                  defaultValue={item.refundableEa}
                  sx={{ width: '180px', ml: '5px' }}
                  rules={{
                    max: {
                      value: item.refundableEa,
                      message: `취소 가능한 수량은 최대 ${item.refundableEa}개 입니다.`,
                    },
                    min: { value: 1, message: `취소수량은 1개 이상 입력하세요` },
                    required: '취소수량을 입력하세요',
                    validate: {
                      value: (ea: string) => {
                        return item.isRequiredEvenEa
                          ? Number(ea) % 2 === 0
                            ? true
                            : '패키지 상품 취소 수량은 짝수만 가능합니다.'
                          : true;
                      },
                    },
                  }}
                />
              </Box>
            );
          }
          return value;
        },
      },
      {
        label: '판매가격',
        dataKey: 'goods.option.priceText',
        align: 'center',
      },
      {
        label: '배송비',
        dataKey: 'shipping.text',
        align: 'center',
        render: (value, item) => {
          return (
            <>
              <Box>{value}</Box>
              {!!item.shipping.cost && <Box>({item.shipping.costText})</Box>}
            </>
          );
        },
        rowSpan: (item) => item.shippingRowspan,
      },
      { label: '상태', dataKey: 'status.name', align: 'center' },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection?.selectedRowKeys]);

  const cancelTypeOptions = useMemo(() => {
    return [
      { label: '전체취소', value: 'ALL', disabled: !isFullRefundable },
      { label: '부분취소', value: 'CASE' },
    ];
  }, [isFullRefundable]);

  return (
    <>
      <Box pb="20px">
        <FormControlRadioGroup<OrderRequestRefundFormField> name="cancelType" options={cancelTypeOptions} />
      </Box>
      <TableWrapperStyled error={!!selectedOptionError ? 'true' : 'false'}>
        <Table
          columns={columns}
          items={refundableItemOptionList}
          rowKey="key"
          pagination={false}
          rowSelection={rowSelection}
          hideAllSelect
          allSelectionLabel="옵션선택"
        />
      </TableWrapperStyled>
      {selectedOptionError && <ErrorTextStyled>{selectedOptionError.message}</ErrorTextStyled>}
      <Grid container spacing={3} justifyContent="center" pt="20px">
        <Grid item md={2}>
          <FormControlSelect<OrderRequestRefundFormField>
            name="reasonCode"
            options={refundReasonItems}
            label="취소사유를 선택하세요"
            rules={{ required: '취소사유를 선택하세요' }}
          />
        </Grid>
        <Grid item md={10}>
          <FormControlTextField<OrderRequestRefundFormField>
            name="reason"
            fullWidth
            placeholder={cancelReasonCode === '900' ? '취소사유를 입력하세요 (필수)' : '추가 사유를 입력하세요'}
            rules={{ required: cancelReasonCode === '900' ? '취소사유를 입력하세요' : false }}
          />
        </Grid>
        <Grid item display="flex" md={12} mt="10px" justifyContent="center">
          <Button type="submit" variant="contained">
            취소 요청
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

const TableWrapperStyled = styled(Box)<{ error: string }>`
  padding: 0 1px;
  border: ${({ error }) => (error === 'true' ? '1px solid red' : 'none')};
  border-radius: 16px;
`;

const ErrorTextStyled = styled(Box)`
  color: red;
  padding: 10px;
`;
