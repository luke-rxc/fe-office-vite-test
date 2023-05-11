import { Table, TableColumnProps } from '@components/table/Table';
import { Card, Box, CardHeader, Button } from '@material-ui/core';
import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RaffleEventBroadcastStatus, rowsPerPageOptions } from '../constants';
import { RaffleEventListItemModel } from '../models';
import { ReturnTypeUseRaffleEventListService } from '../services';
import { StatusChip } from './StatusChip';

interface Props {
  actions?: ReactNode;
  raffleEventList: ReturnTypeUseRaffleEventListService['raffleEventList'];
  isLoading: ReturnTypeUseRaffleEventListService['isLoading'];
  pagination?: ReturnTypeUseRaffleEventListService['pagination'];
  handleClickOpenDashboard: ReturnTypeUseRaffleEventListService['handleClickOpenDashboard'];
}

/**
 * 래플 이벤트 리스트 component
 */
export const RaffleEventList = ({
  actions,
  raffleEventList,
  isLoading,
  pagination,
  handleClickOpenDashboard,
}: Props) => {
  const columns: Array<TableColumnProps<RaffleEventListItemModel>> = useMemo(
    () => [
      { label: '이벤트ID', dataKey: 'id', align: 'center' },
      {
        label: '이벤트명',
        dataKey: 'name',
        align: 'center',
        render: (value, item) => {
          return <Link to={`/raffle-event/detail/${item.id}`}>{value}</Link>;
        },
      },
      { label: '라이브ID', dataKey: 'live.id', align: 'center' },
      { label: '라이브명', dataKey: 'live.title', align: 'center' },
      { label: '라이브시작일', dataKey: 'live.liveStartDateText', align: 'center' },
      { label: '호스트쇼룸', dataKey: 'live.showRoom.info', align: 'center' },
      { label: '추첨횟수', dataKey: 'itemCountText', align: 'center' },
      {
        label: '진행상태',
        dataKey: 'live.broadcastStatusText',
        align: 'center',
        render: (value, { live: { broadcastStatusClassName } }) => {
          return <StatusChip className={broadcastStatusClassName} label={value} />;
        },
      },
      {
        label: '이벤트결과정보',
        dataKey: 'etc',
        render: (_, item) => {
          if (item.live.broadcastStatus === RaffleEventBroadcastStatus.NONE) {
            return null;
          }

          return (
            <Button variant="contained" size="small" onClick={handleClickOpenDashboard(String(item.live.id))}>
              결과 확인
            </Button>
          );
        },
        align: 'center',
      },
    ],
    [handleClickOpenDashboard],
  );

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '100%',
        p: 3,
        mt: 4,
      }}
    >
      <CardHeader action={actions} />
      <Box>
        <Table
          columns={columns}
          items={raffleEventList}
          rowKey="rowKey"
          isLoading={isLoading}
          pagination={pagination}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Box>
    </Card>
  );
};
