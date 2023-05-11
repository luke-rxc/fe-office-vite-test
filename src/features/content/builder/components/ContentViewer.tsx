import type { VFC } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { getComponentGroupName } from '../utils';
import { ContentShowroomModel } from '../models';
import { useContentContext } from '../hooks';
import { Preset } from '../constants';
import {
  ContentBlank,
  ContentCTA,
  ContentDealA,
  ContentDealB,
  ContentFooter,
  ContentHeader,
  ContentLive,
  ContentImageViewer,
  ContentMediaA,
  ContentMediaB,
  ContentMediaViewerA,
  ContentMediaViewerB,
  ContentReply,
  ContentText,
  ContentLiveMultiple,
} from './contents';

/**
 * 컨텐츠 상세 뷰어 컨테이너
 */
type ContentViewerProps = {
  viewId: number | null; // 컨텐츠 id
  showroom: ContentShowroomModel;
};
export const ContentViewer: VFC<ContentViewerProps> = ({ viewId, showroom }) => {
  const { contentData } = useContentContext();
  const content = contentData.get(viewId);
  return (
    <Box sx={{ p: 3 }}>
      {viewId === null && (
        <Grid
          container
          item
          xs={12}
          sx={{ height: 800, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
        >
          컴포넌트를 선택 해 주세요.
        </Grid>
      )}
      {viewId !== null && content && (
        <Box>
          <Typography color="textPrimary" variant="h5">
            {`${getComponentGroupName(content.componentGroup)} 관리`}
          </Typography>
          <Box sx={{ mt: 4 }}>
            {content && (
              <>
                {content.componentType === Preset.BLANK && <ContentBlank content={content} />}
                {content.componentType === Preset.CTA && <ContentCTA content={content} />}
                {content.componentType === Preset.DEAL_A && <ContentDealA content={content} />}
                {content.componentType === Preset.DEAL_B && <ContentDealB content={content} />}
                {content.componentType === Preset.FOOTER && <ContentFooter content={content} />}
                {content.componentType === Preset.HEADER && <ContentHeader content={content} />}
                {content.componentType === Preset.IMAGE_VIEWER && <ContentImageViewer content={content} />}
                {content.componentType === Preset.LIVE && <ContentLive content={content} showroom={showroom} />}
                {content.componentType === Preset.LIVE_MULTIPLE && (
                  <ContentLiveMultiple content={content} showroom={showroom} />
                )}
                {content.componentType === Preset.MEDIA_A && <ContentMediaA content={content} />}
                {content.componentType === Preset.MEDIA_B && <ContentMediaB content={content} />}
                {content.componentType === Preset.MEDIA_VIEWER_A && <ContentMediaViewerA content={content} />}
                {content.componentType === Preset.MEDIA_VIEWER_B && <ContentMediaViewerB content={content} />}
                {content.componentType === Preset.REPLY && <ContentReply content={content} />}
                {content.componentType === Preset.TEXT && <ContentText content={content} />}
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
