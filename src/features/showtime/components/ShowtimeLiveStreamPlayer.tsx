import { Box, Button, Card } from '@material-ui/core';
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { CardHeaderStyled, CardContentStyled } from '.';

interface Props {
  streamUrl: string | undefined;
  isShow: boolean;
  isLoading: boolean;
  updateLoading: (loading: boolean) => void;
}

const playerConfig = {
  file: {
    forceHLS: true,
    hlsOptions: { startFragPrefetch: true },
  },
};

export const ShowtimeLiveStreamPlayer = React.memo(
  ({ streamUrl, isShow, isLoading, updateLoading }: Props) => {
    useEffect(() => {
      if (streamUrl && isShow && !isLoading) {
        setTimeout(() => {
          updateLoading(true);
        }, 2000);
      } else if ((!streamUrl || !isShow) && isLoading) {
        updateLoading(false);
      }
    }, [isShow, isLoading, streamUrl, updateLoading]);

    if (!streamUrl || !isShow) {
      return null;
    }

    if (!isLoading) {
      return (
        <Card>
          <CardHeaderStyled title="스트리밍 실황" />
          <CardContentStyled>
            <Box p={8}>영상을 불러오는 중입니다.</Box>
          </CardContentStyled>
        </Card>
      );
    }

    const onError = (error: any, data?: { details: string }) => {
      //동영상 transcoding중에 에러 발생할 경우 player를 reload 하도록 함
      if (data?.details === 'manifestLoadError') {
        updateLoading(false);
      }
    };

    const reloadPlayer = () => {
      updateLoading(false);
    };

    return (
      <Card>
        <CardHeaderStyled
          title="스트리밍 실황"
          action={
            <Button variant="contained" onClick={reloadPlayer}>
              새로고침
            </Button>
          }
        />
        <CardContentStyled>
          <ReactPlayer
            url={streamUrl}
            playing
            controls
            width="400px"
            height="auto"
            onError={onError}
            config={playerConfig}
          />
        </CardContentStyled>
      </Card>
    );
  },
  (
    { streamUrl: prevStreamUrl, isShow: prevIsShow, isLoading: prevIsLoading },
    { streamUrl: nextStreamUrl, isShow: nextIsShow, isLoading: nextIsLoading },
  ) => prevStreamUrl === nextStreamUrl && prevIsShow === nextIsShow && prevIsLoading === nextIsLoading,
);
