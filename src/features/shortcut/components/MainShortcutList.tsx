import { Table, TableColumnProps } from '@components/table/Table';
import { Box, Button } from '@material-ui/core';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PublishStatus } from '../constants';
import { MainShortcutModel } from '../models';
import { MediaViewer } from './MediaViewer';
import { StatusChip } from './StatusChip';
import ClearIcon from '@material-ui/icons/Clear';

interface Props {
  items: Array<MainShortcutModel>;
  loading: boolean;
  onClickRemovePublish: (id: number) => () => void;
}

export const MainShortcutList = ({ items, loading, onClickRemovePublish: handleClickRemovePublish }: Props) => {
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
          if (!item.landingInfo) {
            window.console.log('item', item);
            return null;
          }
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
          if (status === PublishStatus.FINISHED) {
            return null;
          }

          return (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ClearIcon />}
              onClick={handleClickRemovePublish(id)}
            >
              편성삭제
            </Button>
          );
        },
      },
    ],
    [handleClickRemovePublish],
  );

  return <Table columns={columns} items={items} isLoading={loading} rowKey="id" pagination={false} />;
};
