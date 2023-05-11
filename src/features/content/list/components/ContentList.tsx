import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Chip, IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { TableColumnProps, Table, PaginationProps } from '@components/table/Table';
import { toDateFormat } from '@utils/date';
import { CONTENT_STATUS_TYPE, CONTENT_STATUS_TYPE_LABEL, CONTENT_TYPE_LABEL } from '../constants';
import { ContentListModel } from '../models';
/**
 * 컨텐츠 리스트
 */
type ContentListProps = {
  items: Array<ContentListModel>;
  isLoading: boolean;
  pagination: PaginationProps;
  onModify: (id: number) => void;
  onCopy: (id: number) => void;
};

export const ContentList = ({ items, isLoading, pagination, onModify, onCopy }: ContentListProps) => {
  const contentListColumns: Array<TableColumnProps<ContentListModel>> = [
    {
      label: '콘텐츠 ID',
      dataKey: 'id',
      align: 'center',
      width: '5%',
    },
    {
      label: '콘텐츠 코드',
      dataKey: 'code',
      align: 'center',
      width: '5%',
    },
    {
      label: '콘텐츠 타입',
      dataKey: 'type',
      align: 'center',
      width: '8%',
      render: (value, item) => {
        return <>{CONTENT_TYPE_LABEL[value]}</>;
      },
    },
    {
      label: '콘텐츠명',
      dataKey: 'name',
      align: 'center',
      width: '10%',
    },
    {
      label: '쇼룸명',
      dataKey: 'showRoomName',
      align: 'center',
      width: '9%',
    },
    {
      label: '입점사',
      dataKey: 'providerName',
      align: 'center',
      width: '9%',
    },
    {
      label: '키워드',
      dataKey: 'keywordList',
      align: 'center',
      width: '6%',
      render: (value, item) => {
        return (
          <>
            {item.keywordList &&
              item.keywordList.map((keyword, index) => (
                <Box key={index} sx={{ mt: index === 0 ? 0 : 1 }}>
                  <Chip key={index} color="primary" label={keyword.name} variant="outlined" />
                </Box>
              ))}
          </>
        );
      },
    },
    {
      label: '최초생성일',
      dataKey: 'createdDate',
      align: 'center',
      width: '7%',
      render: (value, item) => {
        return <>{item.createdDate && <p>{toDateFormat(item.createdDate)}</p>}</>;
      },
    },
    {
      label: '최종편집일',
      dataKey: 'updatedDate',
      align: 'center',
      width: '7%',
      render: (value, item) => {
        return <>{item.updatedDate && <p>{toDateFormat(item.updatedDate)}</p>}</>;
      },
    },
    {
      label: '공개기간',
      dataKey: 'publicDate',
      width: '12%',
      align: 'center',
      render: (value, item) => {
        return (
          <>
            {item.publicDate?.publicStartDate && <p>{toDateFormat(item.publicDate.publicStartDate)}</p>}
            {item.publicDate.publicEndDate && <p>~{toDateFormat(item.publicDate?.publicEndDate)}</p>}
          </>
        );
      },
    },
    {
      label: '공개상태',
      dataKey: 'status',
      align: 'center',
      width: '8%',
      render: (value, item) => {
        if (value === CONTENT_STATUS_TYPE.PUBLIC) {
          return <Chip sx={{ minWidth: 100 }} color="primary" label={CONTENT_STATUS_TYPE_LABEL[value]} />;
        } else if (value === CONTENT_STATUS_TYPE.PRIVATE) {
          return <Chip sx={{ minWidth: 100 }} label={CONTENT_STATUS_TYPE_LABEL[value]} />;
        } else {
          return <Chip sx={{ minWidth: 100 }} color="secondary" label={CONTENT_STATUS_TYPE_LABEL[value]} />;
        }
      },
    },
    {
      label: '관리',
      dataKey: 'manage',
      align: 'center',
      width: '9%',
      render: (value, item) => {
        return (
          <>
            <div>
              <Button variant="contained" sx={{ width: '120px' }} onClick={() => onModify(item.id)}>
                기본정보 관리
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                sx={{ width: '120px', mt: 1 }}
                onClick={() => {
                  window.open(`/content/builder/${item.id}`);
                }}
              >
                컨텐츠 편집
              </Button>
            </div>
            <div>
              <RouterLink to={`/content/reply/${item.id}`} style={{ color: 'white', textDecoration: 'none' }}>
                <Button variant="contained" sx={{ width: '120px', mt: 1, color: 'white' }}>
                  댓글관리
                </Button>
              </RouterLink>
            </div>
          </>
        );
      },
    },
    {
      label: '복제',
      dataKey: 'duplicate',
      align: 'center',
      width: '5%',
      render: (value, item) => {
        return (
          <IconButton onClick={() => onCopy(item.id)}>
            <FileCopyIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  return <Table columns={contentListColumns} items={items} rowKey="id" isLoading={isLoading} pagination={pagination} />;
};
