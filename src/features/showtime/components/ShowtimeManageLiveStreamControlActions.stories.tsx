import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BroadcastActionType, BroadcastType, LiveChannelType } from '../constants';
import { toShowtimeLiveChannelModel } from '../models';
import { BroadcastActionInfos } from '../types';
import { showtimeLiveChannelSchemaMock } from '../__mocks__/showtimeLiveChannelSchemaMock';
import { ShowtimeManageLiveStreamControlActions } from './ShowtimeManageLiveStreamControlActions';

export default {
  title: 'Features/Showtime/ShowtimeManageLiveStreamControlActions',
  component: ShowtimeManageLiveStreamControlActions,
} as ComponentMeta<typeof ShowtimeManageLiveStreamControlActions>;

const Template: ComponentStory<typeof ShowtimeManageLiveStreamControlActions> = (args) => {
  const liveChannelItem = toShowtimeLiveChannelModel(showtimeLiveChannelSchemaMock);

  const rehearsalActionInfos: BroadcastActionInfos = [
    [LiveChannelType.CREATE, BroadcastType.REHEARSAL, BroadcastActionType.REHEARSAL, false],
    [LiveChannelType.UPDATE, BroadcastType.REHEARSAL, BroadcastActionType.FINISH_REHEARSAL, true],
  ];

  const onClickActionItem = (
    liveChannelType: LiveChannelType,
    broadcastType: BroadcastType,
    broadcastActionType: BroadcastActionType,
  ) => {
    window.console.log(liveChannelType, broadcastType, broadcastActionType);
  };

  return (
    <ShowtimeManageLiveStreamControlActions
      {...args}
      liveStatusLabel={liveChannelItem.rehearsalStatusLabel}
      liveStatusMessage={liveChannelItem.rehearsalStatusMessage}
      streamStatus={liveChannelItem.rehearsalStreamStatus}
      streamStatusMessage={liveChannelItem.rehearsalStreamStatusMessage}
      broadcastType={BroadcastType.REHEARSAL}
      actionInfos={rehearsalActionInfos}
      onClickActionItem={onClickActionItem}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
