import { Table, TableColumnProps } from '@components/table/Table';
import { saveNoticeMessageMaxCount } from '@features/showtime/constants';
import { Box, Button, Chip } from '@material-ui/core';
import { ReactNode, useMemo, useState } from 'react';
import { createRichText } from './ChatNoticeMessage';

interface Props {
  messages: Array<string>;
  children: ReactNode;
  handleClickUseMessage: (message: string) => () => void;
  handleClickDeleteMessage: (itemIndex: number) => () => void;
}

export const SaveNoticeMessages = ({ children, messages, handleClickUseMessage, handleClickDeleteMessage }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const columns: Array<TableColumnProps<{ message: string }>> = [
    {
      label: '순번',
      dataKey: 'index',
      width: '60px',
      align: 'center',
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      label: '메세지',
      dataKey: 'message',
      render: (value) => {
        return createRichText(value);
      },
    },
    {
      label: '기능',
      dataKey: 'actions',
      width: '180px',
      render: (value, item, index) => {
        return (
          <>
            <Button size="small" variant="contained" onClick={handleClickUseMessage(item.message)}>
              사용
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              sx={{ marginLeft: '10px' }}
              onClick={handleClickDeleteMessage(index)}
            >
              삭제
            </Button>
          </>
        );
      },
    },
  ];

  const items = useMemo(() => {
    return messages.map((message) => {
      return { message };
    });
  }, [messages]);

  const onClickToggleMessageTable = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box p="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: '10px' }}>
        <Box sx={{ fontSize: '14px' }}>
          <Chip size="small" color="primary" label={`총 ${items.length}개`} />
          {open ? ` ${saveNoticeMessageMaxCount}개까지 저장 가능 (사용중인 PC에 저장됨)` : ''}
        </Box>
        <Box>
          {children}
          <Button
            size="small"
            variant="outlined"
            sx={{ ml: '10px' }}
            onClick={onClickToggleMessageTable}
          >{`저장 메세지 목록 ${open ? '숨기기' : '보이기'}`}</Button>
        </Box>
      </Box>

      {open && <Table columns={columns} items={items} rowKey="message" pagination={false} minHeight="90px" />}
    </Box>
  );
};
