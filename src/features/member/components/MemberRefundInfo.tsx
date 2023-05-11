import styled from '@emotion/styled';
import {
  TableContainer,
  Table,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  CardHeader,
  Card,
  CardContent,
} from '@material-ui/core';
import { MemberRefundInfoModel } from '../models';

interface MemberRefundInfoProps {
  item: MemberRefundInfoModel;
}

export const MemberRefundInfo = ({ item }: MemberRefundInfoProps) => {
  if (!item) {
    return null;
  }

  const { bankName, account, depositor } = item;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
      }}
    >
      <CardHeader title="환불 계좌 정보" />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  은행
                </HeaderStyled>
                <TableCell>{bankName}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  계좌 번호
                </HeaderStyled>
                <TableCell>{account}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  예금자명
                </HeaderStyled>
                <TableCell>{depositor}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

const HeaderStyled = styled(TableCell)`
  & {
    width: 150px;
    background-color: #cccccc;
    text-align: center;
  }
`;
