import { ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { BroadcastActionType, BroadcastType, LiveChannelType, LiveStatus } from '../constants';
import { toShowtimeLiveChannelModel } from '../models';
import { BroadcastActionInfos } from '../types';
import { showtimeLiveChannelSchemaMock } from '../__mocks__/showtimeLiveChannelSchemaMock';
import { ShowtimeManageLiveStreamControl } from './ShowtimeManageLiveStreamControl';
import { ShowtimeManageLiveStreamControlActions } from './ShowtimeManageLiveStreamControlActions';

export default {
  title: 'Features/Showtime/ShowtimeManageLiveStreamControl',
  component: ShowtimeManageLiveStreamControl,
} as ComponentMeta<typeof ShowtimeManageLiveStreamControl>;

const Template = (args) => {
  const liveChannelItem = toShowtimeLiveChannelModel(showtimeLiveChannelSchemaMock);

  const [selectedTab, setSelectedTab] = useState<BroadcastType>(BroadcastType.REHEARSAL);

  const getRehearsalActionInfos = (liveStatus: LiveStatus): BroadcastActionInfos => {
    switch (liveStatus) {
      case LiveStatus.NONE:
      case LiveStatus.END:
        return [
          [LiveChannelType.CREATE, BroadcastType.REHEARSAL, BroadcastActionType.REHEARSAL, false],
          [LiveChannelType.UPDATE, BroadcastType.REHEARSAL, BroadcastActionType.FINISH_REHEARSAL, true],
        ];
      case LiveStatus.REHEARSAL:
        return [
          [LiveChannelType.CREATE, BroadcastType.REHEARSAL, BroadcastActionType.REHEARSAL, true],
          [LiveChannelType.UPDATE, BroadcastType.REHEARSAL, BroadcastActionType.FINISH_REHEARSAL, false],
        ];
    }
  };

  const getAirActionInfos = (liveStatus: LiveStatus): BroadcastActionInfos => {
    switch (liveStatus) {
      case LiveStatus.NONE:
      case LiveStatus.END:
        return [
          [LiveChannelType.CREATE, BroadcastType.ON_AIR, BroadcastActionType.ON_AIR, false],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, true],
        ];
      case LiveStatus.STANDBY:
        return [
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.CANCEL_STREAM, false],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, true],
        ];
      case LiveStatus.READY:
        return [
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.CANCEL_STREAM, false],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, false],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, true],
        ];
      case LiveStatus.LIVE:
        return [
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.CHANGE_STREAM, false],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.START_ON_AIR, true],
          [LiveChannelType.UPDATE, BroadcastType.ON_AIR, BroadcastActionType.FINISH_ON_AIR, false],
        ];
    }
  };

  const rehearsalActionInfos: BroadcastActionInfos = getRehearsalActionInfos(liveChannelItem.rehearsalStatus);

  const onAirActionInfos: BroadcastActionInfos = getAirActionInfos(liveChannelItem.liveStatus);

  const onClickActionItem = (
    liveChannelType: LiveChannelType,
    broadcastType: BroadcastType,
    broadcastActionType: BroadcastActionType,
  ) => {
    window.console.log(liveChannelType, broadcastType, broadcastActionType);
  };

  const tabItems = [
    {
      label: '리허설',
      value: BroadcastType.REHEARSAL,
      children: (
        <ShowtimeManageLiveStreamControlActions
          liveStatusLabel={liveChannelItem.rehearsalStatusLabel}
          liveStatusMessage={liveChannelItem.rehearsalStatusMessage}
          streamStatus={liveChannelItem.rehearsalStreamStatus}
          streamStatusMessage={liveChannelItem.rehearsalStreamStatusMessage}
          broadcastType={BroadcastType.REHEARSAL}
          actionInfos={rehearsalActionInfos}
          onClickActionItem={onClickActionItem}
        />
      ),
    },
    {
      label: '본방송',
      value: BroadcastType.ON_AIR,
      children: (
        <ShowtimeManageLiveStreamControlActions
          liveStatusLabel={liveChannelItem.liveStatusLabel}
          liveStatusMessage={liveChannelItem.liveStatusMessage}
          streamStatus={liveChannelItem.liveStreamStatus}
          streamStatusMessage={liveChannelItem.liveStreamStatusMessage}
          broadcastType={BroadcastType.ON_AIR}
          actionInfos={onAirActionInfos}
          onClickActionItem={onClickActionItem}
        />
      ),
    },
  ];

  const onChangeTab = (value: BroadcastType) => {
    setSelectedTab(value);
  };

  return (
    <ShowtimeManageLiveStreamControl
      {...args}
      tabItems={tabItems}
      selectedTab={selectedTab}
      onChangeTab={onChangeTab}
    />
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
