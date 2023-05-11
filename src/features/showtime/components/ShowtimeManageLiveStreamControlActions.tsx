import styled from '@emotion/styled';
import { Box, Button, Grid } from '@material-ui/core';
import { StatusCircleStyled } from '.';
import {
  LiveChannelType,
  BroadcastType,
  BroadcastActionType,
  BroadcastActionTypeLabel,
  StreamStatus,
} from '../constants';
import { BroadcastActionInfos } from '../types';
import { toCamelCase } from '../utils';

interface Props {
  liveStatusLabel: string;
  liveStatusMessage: string;
  streamStatus: StreamStatus;
  streamStatusMessage: string;
  broadcastType: BroadcastType;
  actionInfos: BroadcastActionInfos | null;
  onClickActionItem: (
    liveChannelType: LiveChannelType,
    broadcastType: BroadcastType,
    broadcastActionType: BroadcastActionType,
  ) => void;
}

export const ShowtimeManageLiveStreamControlActions = ({
  liveStatusLabel,
  liveStatusMessage,
  streamStatus,
  streamStatusMessage,
  actionInfos,
  onClickActionItem,
}: Props) => {
  if (!actionInfos) {
    return null;
  }
  const gridSize = actionInfos.length === 3 ? 4 : 6;
  const onClickItem = (
    liveChannelType: LiveChannelType,
    broadcastType: BroadcastType,
    broadcastActionType: BroadcastActionType,
  ) => {
    return () => onClickActionItem(liveChannelType, broadcastType, broadcastActionType);
  };

  return (
    <>
      <Grid container spacing={1}>
        {actionInfos.map(([liveChannelType, broadcastType, broadcastActionType, disabled]) => (
          <Grid item xs={gridSize} key={broadcastActionType}>
            <ActionButtonStyled
              variant="contained"
              className={toCamelCase(broadcastActionType)}
              disabled={disabled}
              onClick={onClickItem(liveChannelType, broadcastType, broadcastActionType)}
            >
              {BroadcastActionTypeLabel[broadcastActionType]}
            </ActionButtonStyled>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ p: '20px 0 0 0' }}>
        <Box display="flex" alignItems="center">
          <StatusCircleStyled className={toCamelCase(streamStatus)} sx={{ mr: '10px' }} />
          <span>{streamStatusMessage}</span>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box>Live Status: {liveStatusLabel}</Box>
          <DescriptionStyled>{liveStatusMessage}</DescriptionStyled>
        </Box>
      </Box>
    </>
  );
};

const DescriptionStyled = styled(Box)`
  margin-top: 10px;
  color: #585858;
  font-size: 12px;
`;

const ActionButtonStyled = styled(Button)`
  width: 100%;

  &:disabled {
    color: #ffffff82;
  }

  &.rehearsal,
  &.onAir {
    background-color: #0000ff;

    &:disabled {
      background-color: #0000ff82;
    }
  }

  &.finishRehearsal,
  &.finishOnAir {
    background-color: #808080;

    &:disabled {
      background-color: #80808082;
    }
  }

  &.cancelStream {
    background-color: #ff9800;

    &:disabled {
      background-color: #ff980082;
    }
  }

  &.startOnAir {
    background-color: #ff0000;

    &:disabled {
      background-color: #ff000082;
    }
  }

  &.changeStream {
    background-color: #1b941b;

    &:disabled {
      background-color: #1b941b82;
    }
  }
`;
