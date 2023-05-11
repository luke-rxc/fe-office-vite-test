import Scrollbar from '@components/Scrollbar';
import { Table, TableColumnProps } from '@components/table/Table';
import { Box, Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { toDateFormat } from '@utils/date';
import { useMemo } from 'react';
import { LandingContentsInfo, LandingInfoCell, MediaViewer, StatusChip } from '.';
import { MainFeedModel } from '../models';
import { UseMainFeedListService } from '../services';

interface Props extends Partial<UseMainFeedListService> {
  items: UseMainFeedListService['mainFeedList'];
  isLoading: UseMainFeedListService['isMainFeedListLoading'];
}

export const MainFeedList = ({ items, isLoading, onDeletePublishing }: Props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const handleDelete = (id: MainFeedModel['id']) => () => {
    onDeletePublishing({ homeFeedId: id });
  };

  const columns: TableColumnProps<MainFeedModel>[] = useMemo(
    () => [
      {
        label: '편성 우선순위',
        dataKey: 'sortNum',
        align: 'center',
      },
      {
        label: '미디어 정보',
        dataKey: 'media.id',
        align: 'center',
        render: (_, { processed: { thumbnail } }) => {
          return <MediaViewer {...thumbnail} alt="편성 피드 이미지" />;
        },
      },
      {
        label: '편성 콘텐츠 정보',
        dataKey: 'landingInfo.referenceId',
        align: 'left',
        render: (_, { id, title }) => {
          return <LandingContentsInfo id={id} name={title} link={String(id)} />;
        },
      },
      {
        label: '랜딩 정보',
        dataKey: 'landingInfo.type',
        align: 'center',
        render: (_, { landingInfo: { referenceId }, processed: { landingTypeLabel } }) => {
          return <LandingInfoCell id={referenceId} typeLabel={landingTypeLabel} />;
        },
      },
      {
        label: '편성 시작일',
        dataKey: 'publishStartDate',
        align: 'center',
        render: (value) => {
          return <div>{toDateFormat(value, 'yyyy-MM-dd HH:mm:ss')}</div>;
        },
      },
      {
        label: '편성 종료일',
        dataKey: 'publishEndDate',
        align: 'center',
        render: (value) => {
          return <div>{toDateFormat(value, 'yyyy-MM-dd HH:mm:ss')}</div>;
        },
      },
      {
        label: '편성 상태',
        dataKey: 'status',
        align: 'center',
        render: (_, { processed: { statusLabel } }) => {
          return <StatusChip label={statusLabel} />;
        },
      },
      {
        label: '관리',
        dataKey: 'manage',
        align: 'center',
        render: (_, { id }) => {
          return (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ClearIcon color="error" />}
              onClick={handleDelete(id)}
            >
              편성삭제
            </Button>
          );
        },
      },
    ],
    [handleDelete],
  );

  return (
    <Scrollbar>
      <Box sx={{ minWidth: 1200 }}>
        <Table columns={columns} items={items} rowKey="id" pagination={false} isLoading={isLoading} />
      </Box>
    </Scrollbar>
  );
};
