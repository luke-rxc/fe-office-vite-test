import { Box, Typography } from '@material-ui/core';

export const MainBannerMediaUploadGuide = () => {
  return (
    <>
      <Box>
        <Typography variant="subtitle2">동영상 업로드 가이드</Typography>
        <Typography variant="caption">- 권장 해상도: 1080 x 1080 px</Typography>
        <br />
        <Typography variant="caption">- 동영상 파일 형식: mp4</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2">이미지 업로드 가이드</Typography>
        <Typography variant="caption">- 권장 이미지 사이즈: 1440 x 1440 px</Typography>
        <br />
        <Typography variant="caption">- 이미지 파일 형식: jpg</Typography>
      </Box>
    </>
  );
};
