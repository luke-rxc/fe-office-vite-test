import { ReactNode, useCallback } from 'react';
import type { VFC } from 'react';
import styled from '@emotion/styled';
import { Badge, Box, Button, FormHelperText, Typography } from '@material-ui/core';
import ArrowForward from '@material-ui/icons/ArrowForward';
import RotateLeftSharpIcon from '@material-ui/icons/RotateLeftSharp';
import PlusIcon from '@assets/icons/Plus';
import { FileUploader, FileUploaderProps } from '@components/uploader/FileUploader';
import { UploadMedia } from '@components/uploader/UploadMedia';
import { UploadFileInfo } from '@models/UploadModel';
import { SORT_TYPE } from '../constants';

/**
 * 미디어(이미지/비디오) 파일업로드/섬네일 뷰
 */
type MediaFileUploaderProps = Omit<FileUploaderProps, 'maxSize'> & {
  /** file error 정보 */
  fileError?: any[];
  /** 기본 파일 업로드 섬네일 상태 */
  emptyStatus?: boolean;
  /**  기본 파일 업로드 섬네일 내 가이드 텍스트 */
  emptyStatusText?: string;
  /** index number */
  index?: number;
  /** 카운팅 뱃지 미사용 */
  noBadge?: boolean;
  /** 첫순번 여부 */
  isFirst?: boolean;
  /** 마지막 순번 여부 */
  isLast?: boolean;
  /** 부가정보  */
  additionalInfo?: ReactNode[];
  /** 파일 순서 변경 */
  onSort?: (sourceIndex: number, targetIndex: number) => void;
  /** 파일 삭제 */
  onRemove?: (index: number) => void;
  /** 파일 변경 */
  onChange?: (fileInfos: UploadFileInfo[]) => void;
};

export const MediaFileUploader: VFC<MediaFileUploaderProps> = ({
  fileInfos = [],
  width,
  height,
  maxFiles,
  multiple,
  fileError,
  emptyStatus = false,
  emptyStatusText = '',
  index = 0,
  noBadge = true,
  isFirst = false,
  isLast = false,
  additionalInfo,
  onSort,
  onRemove,
  onChange,
  ...props
}) => {
  /** 컨텐츠내 파일 업로드 최대 150M으로 제한 */
  const maxSize = 157286400;

  /** 파일 삭제 */
  const handleRemove = useCallback(
    (index: number) => {
      onRemove(index);
    },
    [onRemove],
  );

  /** 파일 정렬 */
  const handleSort = useCallback(
    (sourceIndex: number, type: SORT_TYPE) => {
      const targetIndex = type === SORT_TYPE.LEFT ? sourceIndex - 1 : sourceIndex + 1;
      onSort(sourceIndex, targetIndex);
    },
    [onSort],
  );

  /** 파일 변경 */
  const handleChange = useCallback(
    (fileInfos: UploadFileInfo[]) => {
      onChange(fileInfos);
    },
    [onChange],
  );

  return (
    <MediaWrapperStyled $emptyStatus={emptyStatus}>
      {/* 삭제 영역 */}
      <Box className="delete">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(index);
          }}
        >
          삭제
        </Button>
      </Box>

      {/* 파일 업로드 */}
      <FileUploader
        sx={{
          p: 0,
          //'&:hover': {},
          border: '1px solid',
          cursor: 'pointer',
          background: `${fileError ? `rgba(244,67,54,0.1)` : 'none'}`,
        }}
        fileInfos={fileInfos}
        width={width}
        height={height}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={!emptyStatus ? false : multiple}
        render={() => (
          <>
            {emptyStatus && (
              <>
                <Typography sx={{ textAlign: 'center' }} color="primary" variant="button">
                  {emptyStatusText}
                  <br />
                  <PlusIcon />
                </Typography>
              </>
            )}
            {!emptyStatus && fileInfos.length > 0 && (
              <PreviewStyled {...{ width, height }}>
                {!noBadge && (
                  <Badge
                    color="secondary"
                    badgeContent={index + 1}
                    sx={{ position: 'absolute', top: 20, left: 20 }}
                  ></Badge>
                )}
                <UploadMedia fileInfo={fileInfos[0]} />
                <Box className="btnArea">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mr: 1, minWidth: 30, minHeight: 30, width: 30, height: 30, borderRadius: 15 }}
                  >
                    <RotateLeftSharpIcon />
                  </Button>
                </Box>
              </PreviewStyled>
            )}
          </>
        )}
        onChange={handleChange}
        {...props}
      />
      {/* error field */}
      {fileError && (
        <Box>
          <FormHelperText error>{Object.values(fileError)[0]?.['message']}</FormHelperText>
        </Box>
      )}

      {/* 정렬 */}
      {onSort && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={isFirst}
            startIcon={<ArrowForward />}
            aria-label={SORT_TYPE.LEFT}
            onClick={() => handleSort(index, SORT_TYPE.LEFT)}
            sx={{ transform: 'rotate(180deg)' }}
          ></Button>
          <Button
            disabled={isLast}
            startIcon={<ArrowForward />}
            aria-label={SORT_TYPE.RIGHT}
            onClick={() => handleSort(index, SORT_TYPE.RIGHT)}
          ></Button>
        </Box>
      )}

      {/* 부가 정보 영역 */}
      {additionalInfo !== undefined && <>{additionalInfo[index]}</>}
    </MediaWrapperStyled>
  );
};

const MediaWrapperStyled = styled.div<{ $emptyStatus: boolean }>`
  position: relative;
  flex-direction: column;
  padding: 16px;
  margin-right: 16px;
  margin-bottom: 24px;
  border: ${({ $emptyStatus }) => (!$emptyStatus ? '1px solid #e1e1e1' : 'none')};
  border-radius: 8px;

  & .delete {
    text-align: right;
    margin-bottom: 8px;
    visibility: ${({ $emptyStatus }) => ($emptyStatus ? 'hidden' : 'visible')};
  }
`;

const PreviewStyled = styled(Box)<{ width: number; height: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.1);
  width: ${({ width }) => width || 120}px;
  height: ${({ height }) => height || 120}px;
  overflow: hidden;
  position: relative;
  img,
  video {
    width: 100%;
    height: auto;
  }
  .btnArea {
    position: absolute;
    right: 12px;
    bottom: 12px;
    > button {
      min-width: 30px;
      min-height: 30px;
      border-radius: 15px;
      transform: translateY(50px);
    }
  }
  &:hover .btnArea {
    > button {
      transition: transform 0.3s ease-out;
      transform: translateY(0);
    }
  }
`;
