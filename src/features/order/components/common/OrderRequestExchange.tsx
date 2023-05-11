import { FormControlSelect, FormControlTextField } from '@components/form';
import { TOption } from '@components/Select';
import { Table, TableColumnProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { OrderRequestExchangeableItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderRequestExchangeService } from '@features/order/services';
import { OrderRequestExchangeFormField } from '@features/order/types';
import { Box, Button, Chip, Grid } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { OrderRequestExchangeOption } from './OrderRequestExchangeOption';

interface Props {
  exchangeItemOption: ReturnTypeUseOrderRequestExchangeService['exchangeItemOption'];
  returnReasonItems: ReturnTypeUseOrderRequestExchangeService['returnReasonItems'];
  rowSelection: ReturnTypeUseOrderRequestExchangeService['rowSelection'];
  onClickSelectShippingGroupGoodsOption: ReturnTypeUseOrderRequestExchangeService['handleClickSelectShippingGroupGoodsOption'];
  onChangeOptionEa: ReturnTypeUseOrderRequestExchangeService['handleChangeOptionEa'];
  onRemoveOptionItem: ReturnTypeUseOrderRequestExchangeService['handleRemoveOptionItem'];
  onInsertOptionItem: ReturnTypeUseOrderRequestExchangeService['handleInsertOptionItem'];
  onClearErrorsOption: ReturnTypeUseOrderRequestExchangeService['handleClearErrorsOption'];
  getOptionItemEaOptions: ReturnTypeUseOrderRequestExchangeService['getOptionItemEaOptions'];
}

/**
 * 주문 교환신청 component
 */
export const OrderRequestExchange = ({
  exchangeItemOption: { exchangeableItemOptionList },
  returnReasonItems,
  rowSelection,
  onClickSelectShippingGroupGoodsOption: handleClickSelectShippingGroupGoodsOption,
  onChangeOptionEa: handleChangeOptionEa,
  onRemoveOptionItem: handleRemoveOptionItem,
  onInsertOptionItem: handleInsertOptionItem,
  onClearErrorsOption: handleClearErrorsOption,
  getOptionItemEaOptions,
}: Props) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<OrderRequestExchangeFormField>();
  const cancelReason = watch('reason');
  const selectedOptionError = errors['selectedOption'];

  const columns: Array<TableColumnProps<OrderRequestExchangeableItemOptionModel>> = [
    { label: '입점사', dataKey: 'provider.name', align: 'center', rowSpan: (item) => item.providerRowspan },
    {
      label: '출고그룹선택',
      dataKey: 'export',
      align: 'center',
      render: (value, item) => {
        return (
          <Button
            type="button"
            variant="contained"
            size="small"
            onClick={handleClickSelectShippingGroupGoodsOption(item.exportId)}
          >
            전체옵션선택
          </Button>
        );
      },
      rowSpan: (item) => item.exportGroupRowspan,
    },
    { label: '출고번호', dataKey: 'exportId', align: 'center' },
    {
      label: '상품타입',
      dataKey: 'goods.type.name',
      align: 'center',
      render: (value, item) => {
        return <Chip label={value} color={item.goods.type.code === 'auction' ? 'secondary' : 'default'} />;
      },
    },
    {
      label: '취소가능여부',
      dataKey: 'goods.isCancelable',
      align: 'center',
      render: (_, item) => {
        return (
          <Chip
            label={item.goods.isCancelable ? '취소 가능' : '취소 불가'}
            color={item.goods.isCancelable ? 'default' : 'secondary'}
          />
        );
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
    { label: '출고수량', dataKey: 'exportEa', align: 'center' },
    {
      label: '교환가능수량',
      dataKey: 'exchangeableEa',
      align: 'center',
      width: '180px',
      render: (value, item, index) => {
        if (rowSelection?.selectedRowKeys.includes(item.rowKey)) {
          const options = new Array(item.exchangeableEa)
            .fill(true)
            .map<TOption>((_, index) => {
              return {
                value: index + 1,
                label: (index + 1).toString(),
              };
            })
            .filter((option) => (item.isRequiredEvenEa ? Number(option.value) % 2 === 0 : true));

          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box>
                <FormControlSelect<OrderRequestExchangeFormField>
                  name={`options.${index}.optionEa`}
                  size="small"
                  defaultValue={item.exchangeableEa}
                  options={options}
                  onChange={handleChangeOptionEa(index)}
                />
              </Box>
            </Box>
          );
        }
        return value;
      },
    },
    {
      label: '옵션',
      dataKey: 'goodsOptions',
      render: (value, item, index) => {
        if (rowSelection?.selectedRowKeys.includes(item.rowKey)) {
          return (
            <OrderRequestExchangeOption
              editable
              item={item}
              optionIndex={index}
              getOptionItemEaOptions={getOptionItemEaOptions}
              onRemoveOptionItem={handleRemoveOptionItem}
              onInsertOptionItem={handleInsertOptionItem}
              onClearErrorsOption={handleClearErrorsOption}
            />
          );
        }

        return '-';
      },
    },
    { label: '판매가격', dataKey: 'goods.option.priceText', align: 'center' },
    { label: '상태', dataKey: 'status.name', align: 'center' },
  ];

  return (
    <>
      <TableWrapperStyled error={!!selectedOptionError ? 'true' : 'false'}>
        <Table
          columns={columns}
          items={exchangeableItemOptionList}
          rowKey="rowKey"
          pagination={false}
          rowSelection={rowSelection}
          hideAllSelect
          allSelectionLabel="옵션선택"
        />
      </TableWrapperStyled>
      {selectedOptionError && <ErrorTextStyled>{selectedOptionError.message}</ErrorTextStyled>}
      <Grid container spacing={3} justifyContent="center" pt="20px">
        <Grid item md={2}>
          <FormControlSelect<OrderRequestExchangeFormField>
            name="reasonCode"
            options={returnReasonItems}
            label="교환사유를 선택하세요"
            rules={{ required: '교환사유를 선택하세요' }}
          />
        </Grid>
        <Grid item md={10}>
          <FormControlTextField<OrderRequestExchangeFormField>
            name="reason"
            placeholder={cancelReason === '900' ? '교환사유를 입력하세요 (필수)' : '추가 사유를 입력하세요'}
            rules={{ required: cancelReason === '900' ? '교환사유를 입력하세요' : false }}
            fullWidth
          />
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
