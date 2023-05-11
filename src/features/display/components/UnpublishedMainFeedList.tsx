import Scrollbar from '@components/Scrollbar';
import { Table, TableColumnProps } from '@components/table/Table';
import { Box, Button } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { toDateFormat } from '@utils/date';
import { useMemo } from 'react';
import { LandingContentsInfo, LandingInfoCell, MediaViewer, StatusChip } from '.';
import { MainFeedModel } from '../models';
import { MainFeedStatus } from '../schemas';
import { UseMainFeedListService } from '../services';

interface Props extends Partial<UseMainFeedListService> {
  items: UseMainFeedListService['unpublishedMainFeedList']['content'];
  isLoading: UseMainFeedListService['isUnpublishedMainFeedListLoading'];
}

export const UnpublishedMainFeedList = ({
  items,
  pagination,
  isLoading,
  onAddPublishing,
  alertUnableToPublish,
}: Props) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const handlePublish = (id: MainFeedModel['id'], status: MainFeedStatus) => () => {
    if (status === 'PUBLISH_UNABLE') return alertUnableToPublish();
    onAddPublishing({ homeFeedId: id });
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
        dataKey: 'landingInfo.name',
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
        label: '콘텐츠 상태',
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
        render: (_, { id, status }) => {
          return (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowUpwardIcon />}
              onClick={handlePublish(id, status)}
            >
              편성추가
            </Button>
          );
        },
      },
    ],
    [handlePublish],
  );

  return (
    <Scrollbar>
      <Box sx={{ minWidth: 1200 }}>
        <Table
          columns={columns}
          items={items}
          rowKey="id"
          rowsPerPageOptions={[25, 50, 100]}
          pagination={pagination}
          isLoading={isLoading}
        />
      </Box>
    </Scrollbar>
  );
};
