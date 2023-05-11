import { Table, TableColumnProps } from '@components/table/Table';
import { OrderRefundPriceInfoItemOptionModel } from '@features/order/models';
import { ReturnTypeUseOrderRefundDetailService } from '@features/order/services';
import { Box, Link } from '@material-ui/core';
import { useMemo, FocusEvent } from 'react';
import { ImageBoxStyled } from '@features/order/components';
import { FormControlTextField } from '@components/form';
import { OrderRefundPriceFormField } from '@features/order/types';
import styled from '@emotion/styled';
import { ReturnTypeUseLandingPage } from '@features/order/hooks';
import { RefundStatus } from '@features/order/constants';

interface Props {
  item: ReturnTypeUseOrderRefundDetailService['orderRefundPriceInfo'];
  refundTypeCode: ReturnTypeUseOrderRefundDetailService['orderRefundDetail']['type']['code'];
  refundStatusCode: ReturnTypeUseOrderRefundDetailService['orderRefundDetail']['status']['code'];
  onChangeShippingCost: ReturnTypeUseOrderRefundDetailService['form']['handleChangeShippingCost'];
  onClickOpenService: ReturnTypeUseLandingPage['handleClickOpenService'];
}

/**
 * 환불처리 금액정보 component
 */
export const RefundPriceInfo = ({
  item: { refundItemOptionList },
  refundTypeCode,
  refundStatusCode,
  onChangeShippingCost: handleChangeShippingCost,
  onClickOpenService: handleClickOpenService,
}: Props) => {
  const getRowspan = (item: OrderRefundPriceInfoItemOptionModel) => item.rowspan;
  const getShippingRowspan = (item: OrderRefundPriceInfoItemOptionModel) => item.shippingRowspan;
  const getGoodsOptionRowspan = (item: OrderRefundPriceInfoItemOptionModel) => item.goodsOptionRowSpan;

  const columns: Array<TableColumnProps<OrderRefundPriceInfoItemOptionModel>> = useMemo(
    () => [
      {
        label: '환불요청상품',
        dataKey: 'goods.name',
        align: 'center',
        render: (value, item) => {
          const path = item.goods.primaryImage?.path || '';
          return (
            <Box display="flex" alignItems="center">
              {path && <ImageBoxStyled path={path} />}
              <Link
                color="primary"
                component="a"
                onClick={handleClickOpenService(`/goods/${item.goods.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <Box display="flex" flexDirection="column" justifyContent="flexStart">
                  <Box textAlign="left">{value}</Box>
                  {item.goods.option.optionLabel && <Box textAlign="left">(옵션) {item.goods.option.optionLabel}</Box>}
                </Box>
              </Link>
            </Box>
          );
        },
      },
      {
        label: '수량',
        dataKey: 'refundEa',
        align: 'center',
      },
      { label: '판매가격', dataKey: 'goods.option.priceText', align: 'center' },
      {
        label: '배송비',
        dataKey: 'orderShippingCostText',
        align: 'center',
        rowSpan: getShippingRowspan,
        render: (value, item) => {
          const addCostInfo = item.orderAddShippingCost ? ` (도서산간 ${item.orderAddShippingCostText} 포함)` : '';
          return (
            <>
              <Box>
                {value}
                {addCostInfo}
              </Box>
              {item.orderShippingInfoText && <Box>({item.orderShippingInfoText})</Box>}
            </>
          );
        },
      },
      { label: '쿠폰', dataKey: 'usedCouponPriceText', align: 'center', rowSpan: getGoodsOptionRowspan },
      { label: '환불상품금액', dataKey: 'refundGoodsPriceText', align: 'center' },
      {
        label: '환불배송비',
        dataKey: 'shippingCostText',
        align: 'center',
        rowSpan: getShippingRowspan,
        render: (value, item) => {
          if (refundTypeCode === 'return' && refundStatusCode !== RefundStatus.COMPLETE) {
            return (
              <FormControlInputWrapperStyled>
                <FormControlTextField<OrderRefundPriceFormField>
                  name={`shippingCostList.${item.shippingIndex}`}
                  type="number"
                  size="small"
                  defaultValue=""
                  sx={{ width: '120px' }}
                  onBlur={(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (event.target.value !== '') {
                      handleChangeShippingCost();
                    }
                  }}
                  rules={{ required: true }}
                />
              </FormControlInputWrapperStyled>
            );
          }

          return value;
        },
      },
      {
        label: '반품배송비(입점사)',
        dataKey: 'tempShippingCostText',
        align: 'center',
        rowSpan: getShippingRowspan,
        render: (value, item) => {
          return (
            <>
              {value !== null && <Box>{value} (예상)</Box>}
              {item.returnShippingCostText && <Box>{item.returnShippingCostText} (배송그룹설정)</Box>}
            </>
          );
        },
        hide: refundTypeCode !== 'return',
      },
      { label: '적립금', dataKey: 'refundPointText', align: 'center', rowSpan: getRowspan },
      { label: '장바구니쿠폰', dataKey: 'usedCartCouponPriceText', align: 'center', rowSpan: getRowspan },
    ],
    [refundTypeCode, handleClickOpenService, refundStatusCode, handleChangeShippingCost],
  );

  return <Table columns={columns} items={refundItemOptionList} rowKey="id" pagination={false} minHeight="20px" />;
};

const FormControlInputWrapperStyled = styled.div`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
