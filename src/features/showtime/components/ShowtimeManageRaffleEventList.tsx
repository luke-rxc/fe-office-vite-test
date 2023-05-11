import { Table, TableColumnProps } from '@components/table/Table';
import styled from '@emotion/styled';
import { Box, Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { ShowtimeRaffleEventItemModel } from '../models';
import { ReturnTypeUseShowtimeManageRaffleEventService } from '../services';
import { MediaViewer } from './MediaViewer';
import { StatusChip } from './StatusChip';

type Props = ReturnTypeUseShowtimeManageRaffleEventService['raffleEventInfo'];

export const ShowtimeManageRaffleEventList = ({ item, isLoading, selectedIds, onUpdateSelectedIds }: Props) => {
  const columns: Array<TableColumnProps<ShowtimeRaffleEventItemModel>> = [
    {
      label: '회차 ID',
      dataKey: 'id',
      align: 'center',
    },
    {
      label: '이벤트 회차',
      dataKey: 'sortNumText',
      align: 'center',
    },
    {
      label: '상품 이미지',
      dataKey: 'imagePath',
      align: 'center',
      width: '120px',
      render: (_, { mediaPath, mediaType }) => {
        if (!mediaPath) {
          return null;
        }
        return <MediaViewer fileName={''} fileType={mediaType} path={mediaPath} />;
      },
    },
    {
      label: '이벤트 정보',
      dataKey: 'enterDrawConditionTypeText',
      align: 'center',
      render: (_, { enterDrawConditionTypeText, winnerCountText }) => {
        return (
          <>
            <Box>
              사전 응모조건: <b>{enterDrawConditionTypeText}</b>
            </Box>
            <Box>
              당첨자 수: <b>{winnerCountText}</b>
            </Box>
          </>
        );
      },
    },
    {
      label: '추첨 진행 상태',
      dataKey: 'statusText',
      align: 'center',
      render: (value, { status }) => {
        return <StatusChip label={value} className={status.toLowerCase()} />;
      },
    },
  ];

  const onChange = (_, __, selectedIndex, itemId) => {
    const updateItems = selectedIds.includes(itemId) ? [] : [itemId];
    onUpdateSelectedIds(updateItems);
  };

  return (
    <Card>
      <CardHeaderStyled title="이벤트 회차 선택" />
      <Divider />
      <CardContent>
        <Table<ShowtimeRaffleEventItemModel>
          columns={columns}
          items={item?.itemList ?? []}
          rowKey="id"
          pagination={false}
          isLoading={isLoading}
          hideAllSelect
          rowSelection={{ selectedRowKeys: selectedIds, onChange, enableSelectByRowClick: true }}
        />
      </CardContent>
    </Card>
  );
};

const CardHeaderStyled = styled(CardHeader)`
  .MuiCardHeader-title {
    font-size: 1rem;
  }
`;
