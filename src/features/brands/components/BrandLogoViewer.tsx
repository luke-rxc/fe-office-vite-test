import { Box, Typography } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';
import bytesToSize from '@utils/bytesToSize';
import { BrandLogoSvg } from '../components';

interface BrandLogoViewerProps {
  fileInfo: UploadFileInfo;
  index?: number;
  sx?: any;
}

export const BrandLogoViewer = ({ fileInfo, sx }: BrandLogoViewerProps) => {
  return (
    <>
      <Box
        sx={{
          width: 120,
          height: 120,
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          border: 1,
          borderRadius: 1,
          borderColor: 'divider',
          outline: 'none',
          '& img': {
            maxWidth: '100%',
          },
          mb: 2,
          justifyContent: 'center',
          ...sx,
        }}
      >
        {fileInfo?.path ? (
          <BrandLogoSvg fileInfo={fileInfo} />
        ) : (
          <Typography color="textSecondary" variant="caption">
            브랜드 로고
          </Typography>
        )}
      </Box>
      {fileInfo?.file && (
        <>
          <Typography color="textSecondary" variant="subtitle2">
            업로드 파일 정보
          </Typography>
          <Typography color="textSecondary" sx={{ ml: 1 }} display="block" variant="caption">
            파일 형식: {fileInfo.file.type}
          </Typography>
          <Typography color="textSecondary" sx={{ ml: 1 }} display="block" variant="caption">
            파일 크기: {bytesToSize(fileInfo.file.size)} bytes
          </Typography>
        </>
      )}
    </>
  );
};
