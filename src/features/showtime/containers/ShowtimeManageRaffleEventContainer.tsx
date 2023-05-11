import { Box, Card, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CardHeaderStyled, ShowtimeManageRaffleEventControl, ShowtimeManageRaffleEventList } from '../components';
import { ShowtimeManageRaffleEventWinnerResult } from '../components/ShowtimeManageRaffleEventWinnerResult';
import { useShowtimeManageRaffleEventService } from '../services';

interface Props {
  showTimeId: number;
}

const ShowtimeManageRaffleEventContainer = ({ showTimeId }: Props) => {
  const { raffleEventInfo, raffleEventDetailInfo } = useShowtimeManageRaffleEventService({ showTimeId });
  const { id, name } = raffleEventInfo?.item || { id: null, name: null };

  return (
    <>
      {id ? (
        <Card sx={{ marginBottom: '10px' }}>
          <CardHeaderStyled
            title={
              <>
                이벤트 정보 [이벤트명: {name}, ID:{' '}
                <Link target="_blank" to={`/raffle-event/detail/${id}`}>
                  {id}
                </Link>
                ]
              </>
            }
          />
        </Card>
      ) : null}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ShowtimeManageRaffleEventList {...raffleEventInfo} />
        </Grid>
        <Grid item xs={6}>
          <ShowtimeManageRaffleEventControl {...raffleEventDetailInfo} />
          <Box p="10px" />
          <ShowtimeManageRaffleEventWinnerResult {...raffleEventDetailInfo} />
        </Grid>
      </Grid>
    </>
  );
};

export default ShowtimeManageRaffleEventContainer;
