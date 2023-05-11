import { Box, Card, Chip, Typography } from '@material-ui/core';
import { CardContentStyled, AuctionStatusMessage, AuctionStatusMessageProps } from '.';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import styled from '@emotion/styled';

interface Props extends AuctionStatusMessageProps {
  remainingTime: number;
  bidReportTargetId: number;
  isTargetBidding: boolean;
}

export const AuctionStatus = ({ remainingTime, bidReportTargetId, isTargetBidding, ...messageProps }: Props) => {
  return (
    <Card sx={{ marginTop: '20px' }}>
      <CardContentStyled color="#ffffff">
        <Box>
          <TitleWrapperStyled display="flex" alignItems="center" justifyContent="space-between">
            <TitleStyled variant="h6">입찰 현황 {bidReportTargetId && ` (#${bidReportTargetId})`}</TitleStyled>
            {isTargetBidding && bidReportTargetId && (
              <Chip
                icon={<LiveTvIcon />}
                label="진행중"
                color="secondary"
                variant="filled"
                size="small"
                sx={{ p: '14px 10px' }}
              />
            )}
          </TitleWrapperStyled>
          {remainingTime > 0 && <TimerWrapperStyled>최종 낙찰 타이머: {remainingTime}초</TimerWrapperStyled>}
        </Box>

        <Box sx={{ margin: '0 0 10px 0' }}>
          <AuctionStatusMessage {...messageProps} />
        </Box>
      </CardContentStyled>
    </Card>
  );
};

const TitleWrapperStyled = styled(Box)`
  padding-top: 16px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #d2d2d2;
`;

const TitleStyled = styled(Typography)`
  font-size: 1rem;
`;

const TimerWrapperStyled = styled(Box)`
  @keyframes changeBackgroundColor {
    25% {
      color: #ffffff;
      background-color: #ff9800;
    }
    75% {
      color: #000000;
      background-color: #808080;
    }
  }
  width: 400px;
  margin: 16px 10px;
  padding: 12px;
  color: #000000;
  font-size: 1.25rem;
  background-color: #808080;
  border-radius: 10px;
  animation: changeBackgroundColor 1.5s infinite;
`;
