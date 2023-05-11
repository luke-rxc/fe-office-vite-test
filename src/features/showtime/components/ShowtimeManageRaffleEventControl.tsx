import styled from '@emotion/styled';
import { Box, Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { RaffleEventStatus } from '../constants';
import { ReturnTypeUseShowtimeManageRaffleEventService } from '../services';

type Props = ReturnTypeUseShowtimeManageRaffleEventService['raffleEventDetailInfo'];

export const ShowtimeManageRaffleEventControl = ({
  item,
  isLoading,
  extracting = true,
  enabledAction,
  onClickRaffleEventItemDraw: handleClickRaffleEventItemDraw,
  onClickRaffleEventItemNotifyDraw: handleClickRaffleEventItemNotifyDraw,
}: Props) => {
  const { status, statusInfoText } = item || { status: null, statusInfoText: null };

  return (
    <Card>
      <CardHeaderStyled title="이벤트 컨트롤러" />
      <Divider />
      <CardContent sx={{ padding: '20px 20px' }}>
        {!!item ? (
          <>
            <Box p="10px 0">
              <ActionButtonStyled
                variant="contained"
                className="extract"
                loading={extracting}
                loadingPosition="center"
                disabled={!enabledAction || !status || status === RaffleEventStatus.COMPLETED}
                onClick={handleClickRaffleEventItemDraw}
              >
                당첨자 결과 추출
              </ActionButtonStyled>
            </Box>
            <Box p="10px 0">
              <ActionButtonStyled
                variant="contained"
                className="notification"
                disabled={!enabledAction || !status || status === RaffleEventStatus.STANDBY || extracting}
                onClick={handleClickRaffleEventItemNotifyDraw}
              >
                당첨자 발표 {status && status === RaffleEventStatus.COMPLETED ? '재시작' : '시작'}
              </ActionButtonStyled>
            </Box>
          </>
        ) : (
          <EmptyStyled>{isLoading ? '로딩중입니다' : '이벤트를 선택해주세요'}</EmptyStyled>
        )}

        {statusInfoText && (
          <Box display="flex" alignItems="center" sx={{ p: '10px 0' }}>
            <StatusCircleStyled className={enabledAction ? status.toLowerCase() : ''} sx={{ mr: '10px' }} />
            <span>{enabledAction ? statusInfoText : '라이브가 진행중 상태가 아닙니다'}</span>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const CardHeaderStyled = styled(CardHeader)`
  .MuiCardHeader-title {
    font-size: 1rem;
  }
`;

const EmptyStyled = styled(Box)`
  width: 100%;
  height: 156px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const StatusCircleStyled = styled(Box)`
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #ff0000;
  border-radius: 50%;

  &.draw {
    background-color: #0000ff;
  }

  &.completed {
    background-color: #0000001f;
  }
`;

const ActionButtonStyled = styled(LoadingButton)`
  width: 100%;

  &.extract:not(:disabled) {
    background-color: #ff0000;
  }

  &.notification:not(:disabled) {
    background-color: #5664d2;
  }
`;
