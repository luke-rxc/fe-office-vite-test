import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Divider, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { toDateFormat } from '@utils/date';
import { GeneralInfoModel } from '../models';

const useStyle = makeStyles((theme: Theme) => ({
  card: { paddingTop: theme.spacing(1) },
  label: { width: '40%' },
}));

type Props = Pick<GeneralInfoModel, 'email' | 'createdDate'>;

export const GeneralInfoBase: React.FC<Props> = ({ email, createdDate }) => {
  const styles = useStyle();
  return (
    <Card>
      <CardHeader title="기본 정보" />
      <Divider />
      <CardContent className={styles.card}>
        <Table>
          <colgroup>
            <col className={styles.label} />
            <col />
          </colgroup>
          <TableBody>
            {/** 이메일 */}
            <TableRow>
              <TableCell>이메일</TableCell>
              <TableCell>{email}</TableCell>
            </TableRow>

            {/** 오피스 계정 생성일 */}
            <TableRow>
              <TableCell>오피스 계정 생성일</TableCell>
              <TableCell>{toDateFormat(createdDate, 'yyyy.MM.dd HH:mm')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
