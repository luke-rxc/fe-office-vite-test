import { ReactNode, useCallback } from 'react';
import type { VFC } from 'react';
import styled from '@emotion/styled';
import { Box, Button, FormHelperText, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { FileUploader, FileUploaderProps } from '@components/uploader/FileUploader';
import { UploadMedia } from '@components/uploader/UploadMedia';
import { UploadFileInfo } from '@models/UploadModel';
import { SORT_TYPE } from '../constants';

/**
 * 미디어(이미지/비디오) 파일업로드/섬네일 뷰
 */
type MediaUploaderProps = FileUploaderProps & {
  fileButtonType?: FILE_BUTTON_TYPE; // 파일 추가 버튼 노출 형태. PREVIEW인 경우 섬네일 영역과 동일한 사이즈로 버튼영역을 노출한다.
  fileButtonTitle?: string | ReactNode; // 파일 추가 버튼 내 텍스트
  fileErrors?: any[];
  subInfos?: ReactNode[];
  error?: boolean;
  onFileChange?: (fileInfos: UploadFileInfo[]) => void; // 파일 변경
  onRemove?: (index: number) => void; // 파일 삭제
  onSort?: (sourceIndex: number, targetIndex: number) => void; // 파일 순서 변경
};

export const MediaUploader: VFC<MediaUploaderProps> = ({
  fileInfos,
  width,
  height,
  maxFiles,
  fileButtonType = '',
  fileButtonTitle = '',
  fileErrors = [],
  subInfos,
  error,
  onFileChange,
  onRemove,
  onSort,
  ...props
}) => {
  const handleRemove = useCallback(
    (index: number) => {
      onRemove(index);
    },
    [onRemove],
  );

  const handleSort = useCallback(
    (sourceIndex: number, type: SORT_TYPE) => {
      const targetIndex = type === SORT_TYPE.LEFT ? sourceIndex - 1 : sourceIndex + 1;
      onSort(sourceIndex, targetIndex);
    },
    [onSort],
  );

  const handleChange = useCallback(
    (fileInfos: UploadFileInfo[]) => {
      onFileChange(fileInfos);
    },
    [onFileChange],
  );

  return (
    <>
      {/* 파일 섬네일 영역 */}
      {!!fileInfos.length &&
        fileInfos.map((fileInfo, index) => (
          <Box key={index} sx={{ flexDirection: 'column', width: width, mr: 2, mb: 3 }}>
            <PreviewStyled {...{ width, height }}>
              <UploadMedia fileInfo={fileInfo} />
              <div className="del-wrapper">
                <Button variant="contained" color="secondary" size="small" onClick={() => handleRemove(index)}>
                  <DeleteIcon />
                </Button>
              </div>
            </PreviewStyled>
            {fileErrors[index] && (
              <Box>
                <FormHelperText error>{Object.values(fileErrors[index])[0]?.['message']}</FormHelperText>
              </Box>
            )}
            {onSort && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  disabled={index === 0}
                  startIcon={<ArrowForward />}
                  aria-label={SORT_TYPE.LEFT}
                  onClick={() => handleSort(index, SORT_TYPE.LEFT)}
                  sx={{ transform: 'rotate(180deg)' }}
                ></Button>
                <Button
                  disabled={index === fileInfos.length - 1}
                  startIcon={<ArrowForward />}
                  aria-label={SORT_TYPE.RIGHT}
                  onClick={() => handleSort(index, SORT_TYPE.RIGHT)}
                ></Button>
              </Box>
            )}
            {subInfos !== undefined && <>{subInfos[index]}</>}
          </Box>
        ))}
      {/* 파일 업로드 버튼 영역 */}
      {fileInfos.length !== maxFiles && (
        <>
          <FileUploader
            fileInfos={fileInfos}
            maxFiles={maxFiles}
            width={(fileButtonType === FILE_BUTTON_TYPE.PREVIEW && width) ?? null}
            height={(fileButtonType === FILE_BUTTON_TYPE.PREVIEW && height) ?? null}
            render={() => {
              if (fileButtonType === FILE_BUTTON_TYPE.PREVIEW) {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Typography sx={{ textAlign: 'center' }} color="primary" variant="button">
                      {fileButtonTitle && <>{fileButtonTitle}</>}
                      {!fileButtonTitle && <Add />}
                    </Typography>
                  </Box>
                );
              } else {
                return (
                  <Button variant="outlined">
                    {fileButtonTitle && <>{fileButtonTitle}</>}
                    {!fileButtonTitle && <>UPLOAD</>}
                  </Button>
                );
              }
            }}
            onChange={handleChange}
            {...props}
            sx={{
              p: 0,
              '&:hover': {},
              border: fileButtonType === FILE_BUTTON_TYPE.PREVIEW ? '1px solid' : 'none',
              cursor: 'pointer',
              background: `${!!error ? `rgba(244,67,54,0.2)` : 'none'}`,
            }}
          />
          {fileInfos.length === 0 && fileErrors.length > 0 && (
            <Box>
              <FormHelperText error>{Object.values(fileErrors[0])[0]?.['message']}</FormHelperText>
            </Box>
          )}
        </>
      )}
    </>
  );
};

const FILE_BUTTON_TYPE = {
  PREVIEW: 'PREVIEW', // 미디어 미리보기 사이즈에 맞추어 버튼 형태 노출
  NONE: 'NONE', // 기본 버튼 형태
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
type FILE_BUTTON_TYPE = typeof FILE_BUTTON_TYPE[keyof typeof FILE_BUTTON_TYPE];

const PreviewStyled = styled(Box)<{ width: number; height: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  width: ${({ width }) => width || 120}px;
  height: ${({ height }) => height || 120}px;
  overflow: hidden;
  position: relative;
  img,
  video {
    width: 100%;
    height: auto;
  }
  .del-wrapper {
    position: absolute;
    right: 5px;
    bottom: 5px;
    > button {
      min-width: 40px;
      min-height: 40px;
      border-radius: 10px;
    }
  }
`;
