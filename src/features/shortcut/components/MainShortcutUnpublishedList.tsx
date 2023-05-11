import { PaginationProps, Table, TableColumnProps } from '@components/table/Table';
import { Box, Button } from '@material-ui/core';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PublishStatus } from '../constants';
import { MainShortcutModel } from '../models';
import { MediaViewer } from './MediaViewer';
import { StatusChip } from './StatusChip';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

interface Props {
  items: Array<MainShortcutModel>;
  loading: boolean;
  pagination: PaginationProps;
  onClickAddPublish: (id: number) => () => void;
}

export const MainShortcutUnpublishedList = ({
  items,
  loading,
  pagination,
  onClickAddPublish: handleClickAddPublish,
}: Props) => {
  const columns: Array<TableColumnProps<MainShortcutModel>> = useMemo(
    () => [
      {
        label: '편성 우선순위',
        dataKey: 'sortNum',
        align: 'center',
      },
      {
        label: '미디어 정보',
        dataKey: 'primaryImageFile.fullPath',
        align: 'center',
        render: (_, item) => {
          return <MediaViewer item={item} />;
        },
      },
      {
        label: '편성 콘텐츠 정보',
        dataKey: 'id',
        align: 'left',
        render: (id, item) => {
          return (
            <>
              <Box>편성 ID: {id}</Box>
              <Link to={item.contentsLink}>{item.title}</Link>
            </>
          );
        },
      },
      {
        label: '랜딩 정보',
        dataKey: 'landingTypeText',
        align: 'center',
        render: (id, item) => {
          return (
            <>
              <Box>{item.landingInfo.typeText}</Box>
              <Box>{item.landingInfo.idText}</Box>
            </>
          );
        },
      },
      {
        label: '편성 시작일',
        dataKey: 'publishStartDateText',
        align: 'center',
      },
      {
        label: '편성 종료일',
        dataKey: 'publishEndDateText',
        align: 'center',
      },
      {
        label: '편성 상태',
        dataKey: 'statusText',
        align: 'center',
        render: (_, item) => {
          return <StatusChip className={item.status.toLowerCase()} label={item.statusText} />;
        },
      },
      {
        label: '관리',
        dataKey: 'manage',
        align: 'center',
        render: (_, { id, status }) => {
          if (status !== PublishStatus.PUBLISH_ABLE) {
            return null;
          }

          return (
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowUpwardIcon />}
              onClick={handleClickAddPublish(id)}
            >
              편성추가
            </Button>
          );
        },
      },
    ],
    [handleClickAddPublish],
  );

  return <Table columns={columns} items={items} isLoading={loading} pagination={pagination} rowKey="id" />;
};
