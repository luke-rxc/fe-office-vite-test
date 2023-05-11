import { Table, TableColumnProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { OrderRequestReturnableItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderRequestReturnService } from '@features/order/services';
import { OrderRequestReturnFormField } from '@features/order/types';
import { Box, Button, Chip, Grid } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
import { FormControlSelect, FormControlTextField } from '@components/form';

interface Props {
  returnItemOption: ReturnTypeUseOrderRequestReturnService['returnItemOption'];
  reasonItems: ReturnTypeUseOrderRequestReturnService['reasonItems'];
  rowSelection: ReturnTypeUseOrderRequestReturnService['rowSelection'];
  onClickSelectShippingGroupGoodsOption: ReturnTypeUseOrderRequestReturnService['handleClickSelectShippingGroupGoodsOption'];
}

export const OrderRequestReturn = ({
  returnItemOption: { isTicketGoods, returnableItemOptionList },
  reasonItems,
  rowSelection,
  onClickSelectShippingGroupGoodsOption: handleClickSelectShippingGroupGoodsOption,
}: Props) => {
  const {
    watch,
    formState: { errors },
  } = useFormContext<OrderRequestReturnFormField>();
  const reasonCode = watch('reasonCode');
  const selectedOptionError = errors['selectedOption'];

  const columns: Array<TableColumnProps<OrderRequestReturnableItemOptionModel>> = [
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
      label: '반품가능수량',
      dataKey: 'returnableEa',
      align: 'center',
      width: '180px',
      render: (value, item, index) => {
        if (rowSelection?.selectedRowKeys.includes(item.rowKey)) {
          return (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box>
                <FormControlTextField<OrderRequestReturnFormField>
                  name={`ea.${index}`}
                  size="small"
                  defaultValue={item.returnableEa.toString()}
                  sx={{ width: '170px', ml: '5px' }}
                  rules={{
                    max: {
                      value: item.returnableEa,
                      message: `반품 가능한 수량은 최대 ${item.returnableEa}개 입니다.`,
                    },
                    min: { value: 1, message: `반품수량은 1개 이상 입력하세요` },
                    required: '반품수량을 입력하세요',
                    validate: {
                      value: (ea: string) => {
                        return item.isRequiredEvenEa
                          ? Number(ea) % 2 === 0
                            ? true
                            : '패키지 상품 반품 수량은 짝수만 가능합니다.'
                          : true;
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          );
        }
        return value;
      },
    },
    {
      label: '결제일',
      dataKey: 'ticket.paymentDateText',
      align: 'center',
      hide: !isTicketGoods,
    },
    {
      label: '예약일',
      dataKey: 'ticket.bookingDateText',
      align: 'center',
      hide: !isTicketGoods,
    },
    {
      label: '티켓 유효기간',
      dataKey: 'ticket',
      align: 'center',
      render: (_, item) => {
        return `${item.ticket.startDateText} ~ ${item.ticket.endDateText}`;
      },
      hide: !isTicketGoods,
    },
    {
      label: '티켓상태',
      dataKey: 'ticket.status',
      align: 'center',
      width: '180px',
      render: (_, item) => {
        return (
          <>
            <Box>
              {`${item.ticket.status.name}`}
              {item.ticket.isExpired ? (
                <Box display="inline-block" ml="3px">
                  (
                  <Box display="inline-block" color="red">
                    기간만료
                  </Box>
                  )
                </Box>
              ) : (
                ''
              )}
            </Box>
            <Box mt="3px">{`재발송 횟수: ${item.ticket.resendCount ?? '없음'}`}</Box>
            <Box mt="3px">{`예약일 변경 횟수: ${item.ticket.numberOfDateChanges ?? '없음'}`}</Box>
            <Box mt="3px">{`예약자 변경 횟수: ${item.ticket.numberOfGuestChanges ?? '없음'}`}</Box>
          </>
        );
      },
      hide: !isTicketGoods,
    },
    { label: '판매가격', dataKey: 'goods.option.priceText', align: 'center' },
    { label: '상태', dataKey: 'status.name', align: 'center' },
    {
      label: '비고(취소관련)',
      dataKey: 'ticket.cancelableMessage',
      align: 'center',
      render: (value) => {
        if (!value) {
          return '-';
        }
        return <Box sx={{ color: '#ff0000' }}>{value}</Box>;
      },
      hide: !isTicketGoods,
    },
  ];

  return (
    <>
      <TableWrapperStyled error={!!selectedOptionError ? 'true' : 'false'}>
        <Table
          columns={columns}
          items={returnableItemOptionList}
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
          <FormControlSelect<OrderRequestReturnFormField>
            name="reasonCode"
            options={reasonItems}
            label="반품사유를 선택하세요"
            rules={{ required: '반품사유를 선택하세요' }}
          />
        </Grid>
        <Grid item md={10}>
          <FormControlTextField<OrderRequestReturnFormField>
            name="reason"
            fullWidth
            placeholder={reasonCode === '900' ? '반품사유를 입력하세요 (필수)' : '추가 사유를 입력하세요'}
            rules={{ required: reasonCode === '900' ? '반품사유를 입력하세요' : false }}
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
