import { Table, TableColumnProps } from '@components/table/Table';
import { Card, Divider, CardContent, Box, Grid, Button } from '@material-ui/core';
import { ShowtimeRaffleEventDetailItemModel, ShowtimeRaffleEventDetailItemWinnerModel } from '../models';
import { ReturnTypeUseShowtimeManageRaffleEventService } from '../services';
import { CardHeaderStyled } from './CardStyled';

type Props = ReturnTypeUseShowtimeManageRaffleEventService['raffleEventDetailInfo'];

export const ShowtimeManageRaffleEventWinnerResult = ({
  item,
  extracting,
  onDownloadExcel: handleDownloadExcel,
}: Props) => {
  if (!item) {
    return null;
  }

  const columns: Array<TableColumnProps<ShowtimeRaffleEventDetailItemModel>> = [
    {
      label: '전체 대상자',
      dataKey: 'enterDrawUserCountText',
      align: 'center',
    },
    {
      label: '당첨자 결과 추출 시점',
      dataKey: 'drawDateText',
      align: 'center',
    },
  ];

  const winnerColumns: Array<TableColumnProps<ShowtimeRaffleEventDetailItemWinnerModel>> = [
    {
      label: '순번',
      dataKey: 'sortNum',
      align: 'center',
    },
    {
      label: '이메일',
      dataKey: 'email',
      align: 'center',
    },
    {
      label: '닉네임',
      dataKey: 'nickname',
      align: 'center',
    },
  ];

  if (extracting) {
    return null;
  }

  return (
    <Card>
      <CardHeaderStyled title="당첨자 결과" />
      <Divider />
      <CardContent>
        <Table columns={columns} items={[item]} rowKey="drawDate" pagination={false} />
        <Grid container alignItems="center" m="40px 0 10px" p="0 10px">
          <Grid item xs={6}>
            당첨자 리스트 ({item.winnerListCountText})
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Button variant="contained" disabled={item.winnerList.length === 0} onClick={handleDownloadExcel}>
              엑셀 다운로드
            </Button>
          </Grid>
        </Grid>
        <Box maxHeight="350px" sx={{ overflow: 'scroll', p: '0 10px' }}>
          <Table
            columns={winnerColumns}
            items={item.winnerList}
            rowKey="sortNum"
            pagination={false}
            minHeight="280px"
          />
        </Box>
      </CardContent>
    </Card>
  );
};
