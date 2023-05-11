import styled from '@emotion/styled';
import { OrderDetailModel } from '@features/order/models';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';

interface Props {
  item: OrderDetailModel;
}

export const OrderBasicInfo = ({ item }: Props) => {
  if (!item) {
    return null;
  }

  const { orderer, payment } = item;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              주문자
            </HeaderStyled>
            <TableCell>{orderer.name}</TableCell>
            <HeaderStyled component="th" scope="row">
              결제 수단
            </HeaderStyled>
            <TableCell>{payment.paymentType.name}</TableCell>
          </TableRow>
          <TableRow>
            <HeaderStyled component="th" scope="row">
              연락처
            </HeaderStyled>
            <TableCell>{orderer.phone}</TableCell>
            <HeaderStyled component="th" scope="row">
              결제 정보
            </HeaderStyled>
            <TableCell>{payment.paymentType.description}</TableCell>
          </TableRow>

          <TableRow>
            <HeaderStyled component="th" scope="row">
              이메일
            </HeaderStyled>
            <TableCell colSpan={3}>{orderer.email}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const HeaderStyled = styled(TableCell)`
  & {
    width: 150px;
    background-color: #cccccc;
    text-align: center;
  }
`;
