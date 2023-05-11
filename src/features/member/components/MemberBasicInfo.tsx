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
  Button,
} from '@material-ui/core';
import { useCallback } from 'react';
import { MemberDetailBasicModel } from '../models/MemberDetailModel';

interface Props {
  item: MemberDetailBasicModel;
  onIdentifyReset: (id: number) => Promise<never>;
  onAvailableRejoin: (id: number) => Promise<void>;
}

export const MemberBasicInfo = ({ item, onIdentifyReset, onAvailableRejoin }: Props) => {
  const handleIdentifyReset = useCallback(() => {
    if (item?.isIdentifyResettable) {
      item?.id && onIdentifyReset(item.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, item?.isIdentifyResettable]);

  const handleAvailableReJoin = useCallback(() => {
    if (item?.isPossiblePermanentDropOut) {
      item?.id && onAvailableRejoin(item.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, item?.isPossiblePermanentDropOut]);

  if (!item) {
    return null;
  }

  const {
    id,
    email,
    nickName,
    name,
    phone,
    isIdentifyText,
    isAdultText,
    statusText,
    createdDateText,
    lastLoginDateText,
    ssoConnect,
    isIdentifyResettable,
    isPossiblePermanentDropOut,
    isBlack,
  } = item;

  const actions = () => {
    return [
      isIdentifyResettable ? (
        <Button
          key="연락처 인증 초기화"
          children="연락처 인증 초기화"
          size="large"
          variant="contained"
          className="action-button"
          onClick={handleIdentifyReset}
        />
      ) : null,
      isPossiblePermanentDropOut ? (
        <Button
          key="가입 제한 해제"
          children="가입 제한 해제"
          size="large"
          variant="contained"
          className="action-button"
          onClick={handleAvailableReJoin}
        />
      ) : null,
    ];
  };

  const action = actions();

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
      }}
    >
      <CardHeaderStyled title="사용자 정보" action={action} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  사용자ID
                </HeaderStyled>
                <TableCell>{id}</TableCell>
                <HeaderStyled component="th" scope="row">
                  이메일
                </HeaderStyled>
                <TableCell>{email}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  닉네임
                </HeaderStyled>
                <TableCell>{nickName}</TableCell>
                <HeaderStyled component="th" scope="row">
                  이름
                </HeaderStyled>
                <TableCell>{name}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  연락처
                </HeaderStyled>
                <TableCell>{phone}</TableCell>
                <HeaderStyled component="th" scope="row">
                  휴대폰 인증 여부
                </HeaderStyled>
                <TableCell>{isIdentifyText}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  성인 인증 여부
                </HeaderStyled>
                <TableCell>{isAdultText}</TableCell>
                <HeaderStyled component="th" scope="row">
                  소셜 가입
                </HeaderStyled>
                <TableCell>{ssoConnect}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  상태
                </HeaderStyled>
                <TableCell>{statusText}</TableCell>
                <HeaderStyled component="th" scope="row">
                  가입일
                </HeaderStyled>
                <TableCell>{createdDateText}</TableCell>
              </TableRow>
              <TableRow>
                <HeaderStyled component="th" scope="row">
                  최종방문일
                </HeaderStyled>
                <TableCell>{lastLoginDateText}</TableCell>
                <HeaderStyled component="th" scope="row">
                  블랙리스트
                </HeaderStyled>
                <TableCell>{`${isBlack ? '지정(Y)' : '미지정(N)'}`}</TableCell>
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

const CardHeaderStyled = styled(CardHeader)`
  .action-button {
    margin-left: 8px;
  }
`;
