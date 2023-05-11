import { Box, Grid } from '@material-ui/core';
import {
  ShowtimeLiveStreamPlayer,
  ShowtimeManageContentsInfo,
  ShowtimeManageLiveStreamControl,
  ShowtimeManageStreamInfo,
} from '../components';
import { useShowtimeManageControlboardLiveStreamService } from '../services';
import { useShowtimeManageControlboardService } from '../services/useShowtimeManageControlboardService';

interface Props {
  showTimeId: number;
}

const ShowtimeManageControlboardContainer = ({ showTimeId }: Props) => {
  const {
    showtimeContentsItem,
    showtimeLiveChannelItem,
    onClickClipboardCopy: handleClickClipboardCopy,
  } = useShowtimeManageControlboardService(showTimeId);
  const {
    selectedTab,
    tabItems,
    isLoadingPlayer,
    onChangeTab: handleChangeTab,
    updateLoadingPlayer,
  } = useShowtimeManageControlboardLiveStreamService(showTimeId, showtimeLiveChannelItem);

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <ShowtimeManageContentsInfo item={showtimeContentsItem} />
        <Box p="10px" />
        <ShowtimeManageLiveStreamControl tabItems={tabItems} selectedTab={selectedTab} onChangeTab={handleChangeTab} />
        <Box p="10px" />
        <ShowtimeManageStreamInfo
          item={showtimeLiveChannelItem}
          selectedBroadcastType={selectedTab}
          onClickClipboardCopy={handleClickClipboardCopy}
        />
      </Grid>
      <Grid item xs={6}>
        <ShowtimeLiveStreamPlayer
          streamUrl={showtimeLiveChannelItem?.streamUrl}
          isShow={showtimeLiveChannelItem?.isShowPlayer}
          isLoading={isLoadingPlayer}
          updateLoading={updateLoadingPlayer}
        />
      </Grid>
    </Grid>
  );
};

export default ShowtimeManageControlboardContainer;
