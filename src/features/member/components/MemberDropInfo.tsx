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
import { MemberDropModel } from '../models';

interface MemberDropInfoProps {
  item: MemberDropModel;
}

export const MemberDropInfo = ({ item }: MemberDropInfoProps) => {
  if (!item) {
    return null;
  }

  const { createdDateText, reason, reasonText } = item;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
      }}
    >
      <CardHeader title="탈퇴 정보" />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  탈퇴일
                </HeaderStyled>
                <TableCell>{createdDateText}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  탈퇴 사유
                </HeaderStyled>
                <TableCell>{reason}</TableCell>
              </TableRow>
              {reasonText !== '' && (
                <TableRow>
                  <HeaderStyled component="th" scope="row">
                    탈퇴 상세 사유
                  </HeaderStyled>
                  <TableCell>{reasonText}</TableCell>
                </TableRow>
              )}
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
