import styled from '@emotion/styled';
import { Box } from '@material-ui/core';

export const StatusCircleStyled = styled(Box)`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #ff0000;
  border-radius: 50%;

  &.blockedWaiting,
  &.none {
    background-color: #7b7b7b;
  }
  &.waiting,
  &.standby {
    background-color: #0000ff;
  }
  &.opening,
  &.waiting {
    background-color: #ffff00;
  }
  &.bidding,
  &.processing {
    background-color: #1b941b;
  }
  &.countdown {
    background-color: #1b941b;
  }
  &.pause {
    background-color: #1b941b;
  }
  &.successfulBid,
  &.finished {
    background-color: #000000;
  }

  &.disconnected {
    background-color: #ff0000;
  }
`;
