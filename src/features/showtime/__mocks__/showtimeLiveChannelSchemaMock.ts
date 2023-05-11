import { LiveStatus, RehearsalStatus, StreamStatus } from '../constants';
import { ShowtimeLiveChannelSchema } from '../schemas';

export const showtimeLiveChannelSchemaMock: ShowtimeLiveChannelSchema = {
  liveStatus: 'END' as LiveStatus,
  liveStreamStatus: 'NONE' as StreamStatus,
  rehearsalStatus: 'NONE' as RehearsalStatus,
  rehearsalStreamStatus: 'NONE' as StreamStatus,
  liveRtmpUrl: 'rtmp://rtmp-ls2-k1.video.media.ntruss.com:8080/relay',
  liveStreamKey: 'veyat1p6cqfq1h15lnocsct4zzqzqkop',
  liveStreamUrl: 'https://dev-showtime-live.cdn.ntruss.com/dvr/video/ls-20210906162226-aWgXw/playlist.m3u8',
  liveOriginalUrl: 'https://vod.cdn.ntruss.com/DEV_rehearsal_20/34721-107700-202109061622.mp4',
  rehearsalRtmpUrl: null,
  rehearsalStreamKey: null,
  rehearsalStreamUrl: null,
  rehearsalOriginalUrl: null,
};
