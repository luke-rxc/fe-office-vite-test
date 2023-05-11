import type { VFC } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Modal } from '@components/Modal';
import { ReplyReportModel } from '../models';

/**
 * 댓글 신고 상세
 */
type ReplyReportProps = {
  report: ReplyReportModel[];
  handleConfirm: (e: any) => void;
};
export const ReplyReport: VFC<ReplyReportProps> = ({ report, handleConfirm }) => {
  return (
    <Modal
      title="댓글 신고 상세"
      open={true}
      width={700}
      minHeight={600}
      maxWidth="initial"
      confirmText="확인"
      onConfirm={handleConfirm}
    >
      <TableContainer>
        <Table>
          <TableHead sx={{ background: '#dcdcdc' }}>
            <TableRow>
              <TableCell sx={{ width: '50%', fontWeight: 'bold' }} align="center">
                신고 항목
              </TableCell>
              <TableCell sx={{ width: '50%', fontWeight: 'bold' }} align="center">
                신고 횟수
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {report.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{item.reason}</TableCell>
                  <TableCell align="center">{item.count}</TableCell>
                </TableRow>
              ))}
            </>
          </TableBody>
        </Table>
      </TableContainer>
    </Modal>
  );
};
