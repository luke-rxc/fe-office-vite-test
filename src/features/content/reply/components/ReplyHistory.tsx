import type { VFC } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Chip } from '@material-ui/core';
import { Modal } from '@components/Modal';
import { toDateFormat } from '@utils/date';
import { ReplyHistoryModel } from '../models';
import { REPLY_STATUS_TYPE_LABEL } from '../constants';

/**
 * 댓글 이력
 */
type ReplyHistoryProps = {
  history: ReplyHistoryModel;
  handleConfirm: (e: any) => void;
};
export const ReplyHistory: VFC<ReplyHistoryProps> = ({ history, handleConfirm }) => {
  const { updatedDate, email, status } = history;
  return (
    <Modal
      title="댓글 관리 이력"
      open={true}
      width={700}
      minHeight={200}
      maxWidth="initial"
      confirmText="확인"
      onConfirm={handleConfirm}
    >
      <TableContainer>
        <Table>
          <TableHead sx={{ background: '#dcdcdc' }}>
            <TableRow>
              <TableCell sx={{ width: '34%', fontWeight: 'bold' }} align="center">
                관리자 처리일
              </TableCell>
              <TableCell sx={{ width: '33%', fontWeight: 'bold' }} align="center">
                관리자 정보
              </TableCell>
              <TableCell sx={{ width: '33%', fontWeight: 'bold' }} align="center">
                관리 상태
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">{toDateFormat(updatedDate)}</TableCell>
              <TableCell align="center">{email}</TableCell>
              <TableCell align="center">
                <Chip color="secondary" label={REPLY_STATUS_TYPE_LABEL[status]} variant="outlined" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Modal>
  );
};
