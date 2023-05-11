import styled from '@emotion/styled';
import { OrderDetailCommonOrderItemModel } from '@features/order/models';
import { Box, Link } from '@material-ui/core';

interface Props {
  item: OrderDetailCommonOrderItemModel;
}

/**
 * 교환주문 정보 component
 */
export const OrderExchangeOrderInfo = ({ item }: Props) => {
  if (!item.originalOrderId) {
    return null;
  }

  return (
    <>
      <ReorderWrapperStyled display="flex">
        <Box className="title">교환주문</Box> (원주문번호:
        <Link href={`/order/detail/${item.originalOrderId}`}>{item.originalOrderId}</Link>)
      </ReorderWrapperStyled>
      <Box p="10px 0" />
    </>
  );
};

const ReorderWrapperStyled = styled(Box)`
  padding: 10px;
  background-color: #ffffff;
  border-radius: 16px;

  > div.title {
    font-weight: bold;
    margin-right: 10px;
  }
`;
