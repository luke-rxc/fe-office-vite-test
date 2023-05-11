import { Card } from '@material-ui/core';
import React from 'react';
import { FormLayout } from '.';
import { CardHeaderStyled, CardContentStyled, ShowtimeManageStreamInfoItem } from '.';
import { BroadcastType, BroadcastTypeLabel } from '../constants';
import { ShowtimeLiveChannelModel } from '../models';

interface Props {
  item: ShowtimeLiveChannelModel;
  selectedBroadcastType: BroadcastType;
  onClickClipboardCopy: (value: string) => () => void;
}

/**
 * 스트림 정보 component
 */
export const ShowtimeManageStreamInfo = React.memo(
  ({ item, selectedBroadcastType, onClickClipboardCopy: handleClickClipboardCopy }: Props) => {
    if (!item) {
      return null;
    }

    return (
      <Card>
        <CardHeaderStyled title={`스트림 정보 (${BroadcastTypeLabel[selectedBroadcastType]})`} />
        <CardContentStyled>
          <FormLayout label="RTMP URL">
            <ShowtimeManageStreamInfoItem
              value={selectedBroadcastType === BroadcastType.ON_AIR ? item.liveRtmpUrl : item.rehearsalRtmpUrl}
              onClickClipboardCopy={handleClickClipboardCopy}
            />
          </FormLayout>
          <FormLayout label="Stream Key">
            <ShowtimeManageStreamInfoItem
              value={selectedBroadcastType === BroadcastType.ON_AIR ? item.liveStreamKey : item.rehearsalStreamKey}
              onClickClipboardCopy={handleClickClipboardCopy}
            />
          </FormLayout>
          <FormLayout label="Streaming URL">
            <ShowtimeManageStreamInfoItem
              value={selectedBroadcastType === BroadcastType.ON_AIR ? item.liveStreamUrl : item.rehearsalStreamUrl}
              onClickClipboardCopy={handleClickClipboardCopy}
            />
          </FormLayout>
          <FormLayout label="원본 영상 URL">
            <ShowtimeManageStreamInfoItem
              value={selectedBroadcastType === BroadcastType.ON_AIR ? item.liveOriginalUrl : item.rehearsalOriginalUrl}
              onClickClipboardCopy={handleClickClipboardCopy}
            />
          </FormLayout>
        </CardContentStyled>
      </Card>
    );
  },
);
