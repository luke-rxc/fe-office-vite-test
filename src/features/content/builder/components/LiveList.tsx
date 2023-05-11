import type { VFC } from 'react';
import { format } from 'date-fns';
import { Box } from '@material-ui/core';
import ImageIcon from '@assets/icons/Image';
import { TableColumnProps, Table, TableProps } from '@components/table/Table';
import { getImageLink } from '@utils/link';
import { LiveModel } from '../models';
import { LIVE_CONTENT_TYPE_LABEL, LIVE_OPEN_STATUS_LABEL } from '../constants';

/**
 * 라이브 리스트
 */
type LiveListProps = Omit<TableProps<LiveModel>, 'columns'>;
export const LiveList: VFC<LiveListProps> = ({ items, isLoading = false, pagination, rowKey = '', ...props }) => {
  return (
    <Table
      columns={liveTableColumns}
      items={items}
      rowKey="id"
      isLoading={isLoading}
      pagination={pagination}
      {...props}
    ></Table>
  );
};

export const liveTableColumns: Array<TableColumnProps<LiveModel>> = [
  {
    label: '콘텐츠 번호',
    dataKey: 'id',
    width: '5%',
    align: 'center',
  },
  {
    label: '콘텐츠 타입',
    dataKey: 'contentsType',
    width: '10%',
    render: (value: string, item: LiveModel) => {
      return <>{item.contentsType && LIVE_CONTENT_TYPE_LABEL[item.contentsType]}</>;
    },
    align: 'center',
  },
  {
    label: '콘텐츠 제목',
    dataKey: 'title',
    width: '17%',
  },
  {
    label: '쇼룸',
    dataKey: 'showRoomName',
    width: '15%',
    align: 'center',
  },
  {
    label: '상품정보',
    dataKey: 'goodsName',
    width: '13%',
    align: 'center',
  },
  {
    label: '대표 이미지',
    dataKey: 'primaryImage',
    width: '10%',
    render: (value: string, item: LiveModel) => {
      const imageUrl = item.primaryImage.path;
      return <ListThumbImageContainer isImage={!!imageUrl} url={imageUrl} />;
    },
    align: 'center',
  },
  {
    label: '라이브 시작일',
    dataKey: 'liveStartDate',
    width: '10%',
    render: (value: string, item: LiveModel) => {
      return <>{format(item.liveStartDate, 'yyyy/MM/dd HH:mm:ss')}</>;
    },
  },
  {
    label: '라이브 상태',
    dataKey: 'liveStatus',
    width: '10%',
    align: 'center',
  },
  {
    label: '공개 상태',
    dataKey: 'openStatus',
    width: '10%',
    render: (value: string, item: LiveModel) => {
      return <>{item.openStatus && LIVE_OPEN_STATUS_LABEL[item.openStatus]}</>;
    },
    align: 'center',
  },
];

/**
 * 테이블 리스트 내 섬네일 이미지
 * @param param0
 * @returns
 */
const ListThumbImageContainer = ({ isImage, url }: { isImage?: boolean; url?: string }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: 100,
        height: 100,
        border: '1px solid #eee',
        '& > img': {
          width: '100%',
          height: 'auto',
        },
      }}
    >
      {isImage ? <img alt="live 대표이미지" src={getImageLink(url, 192)} /> : <ImageIcon fontSize="small" />}
    </Box>
  );
};
