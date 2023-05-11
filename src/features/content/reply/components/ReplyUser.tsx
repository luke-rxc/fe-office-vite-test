import type { VFC } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Modal } from '@components/Modal';
import { ReplyUserModel } from '../models';

/**
 * 댓글 작성 사용자
 */
type ReplyUserProps = {
  user: ReplyUserModel;
  handleConfirm: (e: any) => void;
};
export const ReplyUser: VFC<ReplyUserProps> = ({ user, handleConfirm }) => {
  const { email, nickname } = user;
  return (
    <Modal
      title="댓글 작성 사용자"
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
              <TableCell sx={{ width: '50%', fontWeight: 'bold' }} align="center">
                사용자 닉네임
              </TableCell>
              <TableCell sx={{ width: '50%', fontWeight: 'bold' }} align="center">
                사용자 이메일
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">{nickname}</TableCell>
              <TableCell align="center">{email}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Modal>
  );
};
