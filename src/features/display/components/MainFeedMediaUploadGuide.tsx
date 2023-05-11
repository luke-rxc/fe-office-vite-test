import { Box, Typography } from '@material-ui/core';

export const MainFeedMediaUploadGuide = () => {
  return (
    <Box>
      <Typography variant="subtitle2">동영상 업로드 가이드</Typography>
      <Typography variant="caption">- 권장 해상도: 1080 x 1920 px</Typography>
      <br />
      <Typography variant="caption">- 동영상 파일 형식: mp4</Typography>
    </Box>
  );
};
