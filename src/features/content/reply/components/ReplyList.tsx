import { Button, Chip } from '@material-ui/core';
import styled from '@emotion/styled';
import { TableColumnProps, Table, TableProps } from '@components/table/Table';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { toDateFormat } from '@utils/date';
import { REPLY_STATUS_TYPE, REPLY_STATUS_TYPE_LABEL, REPLY_USER_STATUS_TYPE } from '../constants';
import { ReplyListModel, ReplyUserModel, ReplyHistoryModel, ReplyReportModel } from '../models';

/**
 * 컨텐츠 댓글 리스트
 */
type ReplyListProps = Omit<TableProps<ReplyListModel>, 'columns' | 'rowKey'> & {
  isLoading: boolean;
  onSelectedUser: (user: ReplyUserModel) => void;
  onSelectedReport: (report: ReplyReportModel[]) => void;
  onSelectedHistory: (history: ReplyHistoryModel) => void;
  onDeleteReply: (item: ReplyListModel) => void;
};

export const ReplyList = ({
  items,
  isLoading,
  pagination,
  sort,
  onSelectedUser,
  onSelectedReport,
  onSelectedHistory,
  onDeleteReply,
}: ReplyListProps) => {
  const { open: openDialog, close: closeDialog } = useDialog();

  const handleUserInfo = (item: ReplyListModel) => {
    onSelectedUser(item.user);
  };
  const handleReportInfo = (item: ReplyListModel) => {
    onSelectedReport(item.reportReasonCounts);
  };
  const handleReplyHistory = (item: ReplyListModel) => {
    onSelectedHistory(item.history);
  };

  const handleDeleteReply = (item: ReplyListModel) => {
    openDialog({
      title: '댓글 삭제',
      content:
        '해당 댓글을 관리자 삭제(블라인드) 처리 하시나요?\r\n삭제된 댓글은 서비스 화면에서 모든 사용자에게\r\n비노출 처리 되며, 삭제 취소가 불가 합니다',
      type: DialogType.CONFIRM,
      onConfirm: () => {
        closeDialog();
        onDeleteReply(item);
      },
    });
  };

  const getButtonColorType = (status: REPLY_STATUS_TYPE) => {
    switch (status) {
      case REPLY_STATUS_TYPE.NORMAL:
        return 'default';
      case REPLY_STATUS_TYPE.ADMIN_DELETE:
        return 'secondary';
      case REPLY_STATUS_TYPE.USER_DELETE:
        return 'primary';
      case REPLY_STATUS_TYPE.DROP_OUT_DELETE:
        return 'default';
    }
  };

  const replyListColumns: Array<TableColumnProps<ReplyListModel>> = [
    {
      label: 'No',
      dataKey: 'id',
      align: 'center',
      width: '5%',
      useSort: true,
    },
    {
      label: (
        <>
          댓글
          <br />
          작성일
        </>
      ),
      dataKey: 'createdDate',
      align: 'center',
      width: '10%',
      render: (value, item) => {
        return <>{item.createdDate && <p>{toDateFormat(item.createdDate)}</p>}</>;
      },
    },
    {
      label: (
        <>
          댓글
          <br />
          삭제일
          <br />
          <span style={{ fontSize: '11px' }}>(사용자 직접/탈퇴 삭제)</span>
        </>
      ),
      dataKey: 'deleteDate',
      align: 'center',
      width: '10%',
      render: (value, item) => {
        return (
          <>
            {item.deleteDate && <p>{toDateFormat(item.deleteDate)}</p>}
            {!item.deleteDate && <p>-</p>}
          </>
        );
      },
    },
    {
      label: '댓글 내용',
      dataKey: 'contents',
      align: 'left',
      width: '27%',
    },
    {
      label: '작성자 닉네임',
      dataKey: 'user',
      align: 'center',
      width: '12%',
      render: (value, item) => {
        return (
          <>
            {item.user && (
              <ButtonLinkStyled onClick={() => handleUserInfo(item)}>
                <>
                  {item.user?.nickname}
                  {item.user.status === REPLY_USER_STATUS_TYPE.DROP_OUT && (
                    <>
                      <br />
                      (탈퇴사용자)
                    </>
                  )}
                </>
              </ButtonLinkStyled>
            )}
          </>
        );
      },
    },
    {
      label: '댓글 신고',
      dataKey: 'reportCount',
      align: 'center',
      width: '8%',
      useSort: true,
      render: (value, item) => {
        return (
          <>
            {item.reportCount !== 0 && (
              <ButtonLinkStyled onClick={() => handleReportInfo(item)}>{item.reportCount}</ButtonLinkStyled>
            )}
            {!item.reportCount && <p>-</p>}
          </>
        );
      },
    },
    {
      label: '댓글 상태',
      dataKey: 'status',
      align: 'center',
      width: '8%',
      render: (value, item) => {
        const title = REPLY_STATUS_TYPE_LABEL[item.status];
        const colorType = getButtonColorType(item.status);
        const variant = item.status === REPLY_STATUS_TYPE.DROP_OUT_DELETE ? 'filled' : 'outlined';
        return (
          <Chip
            color={colorType}
            disabled={item.status === REPLY_STATUS_TYPE.DROP_OUT_DELETE}
            variant={variant}
            label={title}
          />
        );
      },
    },
    {
      label: (
        <>
          관리자
          <br />
          처리일
        </>
      ),
      dataKey: 'history',
      align: 'center',
      width: '10%',
      render: (value, item) => {
        return (
          <>
            {item.history && <p>{toDateFormat(item.history?.updatedDate)}</p>}
            {(!item.history || !item.history.updatedDate) && <p>-</p>}
          </>
        );
      },
    },
    {
      label: '관리',
      dataKey: '',
      align: 'center',
      width: '10%',
      render: (value, item) => {
        return (
          <>
            {item.status === REPLY_STATUS_TYPE.NORMAL && (
              <Button
                sx={{ minWidth: 100 }}
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteReply(item)}
              >
                댓글 삭제
              </Button>
            )}
            {item.status === REPLY_STATUS_TYPE.ADMIN_DELETE && (
              <Button sx={{ minWidth: 100 }} variant="contained" onClick={() => handleReplyHistory(item)}>
                관리 이력
              </Button>
            )}
            {item.status === REPLY_STATUS_TYPE.USER_DELETE && <p>-</p>}
            {item.status === REPLY_STATUS_TYPE.DROP_OUT_DELETE && <p>-</p>}
          </>
        );
      },
    },
  ];

  return (
    <Table
      columns={replyListColumns}
      items={items}
      rowKey="id"
      isLoading={isLoading}
      pagination={pagination}
      sort={sort}
    />
  );
};

const ButtonLinkStyled = styled('a')`
  text-decoration: underline;
  color: #5665d2;
  cursor: pointer;
`;
