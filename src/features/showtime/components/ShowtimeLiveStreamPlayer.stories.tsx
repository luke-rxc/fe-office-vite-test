import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ShowtimeLiveStreamPlayer } from './ShowtimeLiveStreamPlayer';

export default {
  title: 'Features/Showtime/ShowtimeLiveStreamPlayer',
  component: ShowtimeLiveStreamPlayer,
} as ComponentMeta<typeof ShowtimeLiveStreamPlayer>;

const Template: ComponentStory<typeof ShowtimeLiveStreamPlayer> = (args) => {
  return <ShowtimeLiveStreamPlayer {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  streamUrl: 'https://dev-showtime-live.cdn.ntruss.com/dvr/video/ls-20210923114004-dvmuN/playlist.m3u8',
  isLive: false,
};
