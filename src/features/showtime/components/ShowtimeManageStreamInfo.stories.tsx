import { useClipboardCopy } from '@hooks/useClipboardCopy';
import { ComponentMeta } from '@storybook/react';
import { toShowtimeLiveChannelModel } from '../models';
import { showtimeLiveChannelSchemaMock } from '../__mocks__/showtimeLiveChannelSchemaMock';
import { ShowtimeManageStreamInfo } from './ShowtimeManageStreamInfo';

export default {
  title: 'Features/Showtime/ShowtimeManageStreamInfo',
  component: ShowtimeManageStreamInfo,
} as ComponentMeta<typeof ShowtimeManageStreamInfo>;

const Template = (args) => {
  const copy = useClipboardCopy();

  const { liveRtmpUrl, liveStreamKey, liveStreamUrl, liveOriginalUrl } =
    toShowtimeLiveChannelModel(showtimeLiveChannelSchemaMock);

  const onSuccessClipboardCopy = () => {
    alert('복사가 완료되었습니다.');
  };

  const onErrorClipboardCopy = () => {
    alert('복사 도중 문제가 발생하였습니다.');
  };

  const onClickClipboardCopy = (value: string) => {
    return () => copy(value, { onSuccess: onSuccessClipboardCopy, onError: onErrorClipboardCopy });
  };

  return (
    <ShowtimeManageStreamInfo
      {...args}
      rtmpUrl={liveRtmpUrl}
      streamKey={liveStreamKey}
      streamUrl={liveStreamUrl}
      originalUrl={liveOriginalUrl}
      onClickClipboardCopy={onClickClipboardCopy}
    />
  );
};

export const DEFAULT = Template.bind({});
DEFAULT.args = {};
