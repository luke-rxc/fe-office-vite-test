import { FileUploader } from '@components/uploader/FileUploader';
import { Box, Button, Grid } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';
import { UploadMediaWithAction } from '@components/uploader/UploadMediaWithAction';
import { FormControlInput } from '@components/form';
import { MainShortcutFormField } from '../types';
import { UploadContentsPrimaryImageHelper } from './UploadContentsPrimaryImageHelper';
import { LottieViewer } from './LottieViewer';
import React, { useState } from 'react';
import { IconButton } from '@components/IconButton';
import { PlayArrow, Pause } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from '@emotion/styled';
import ReactPlayer from 'react-player';
import { pathConfig } from '@config';

interface Props {
  name: keyof MainShortcutFormField;
  accept?: string | Array<string>;
  contents: Array<UploadFileInfo>;
  requiredMessage?: string | false;
  multiple?: boolean;
  maxFiles?: number;
  helperLabels?: Array<Array<string>>;
  onChangeUploadFile: (fileInfos: Array<UploadFileInfo>) => void;
  onRemoveUploadFile: (index: number) => void;
}

/**
 * upload content component
 */
export const UploadContents = ({
  name,
  accept = 'image/*, video/*',
  contents,
  requiredMessage = false,
  multiple = false,
  maxFiles,
  helperLabels,
  onChangeUploadFile,
  onRemoveUploadFile,
}: Props) => {
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const handleTogglePlay = () => {
    setIsPaused((prev) => !prev);
  };

  const onClickDeleteContents = (index: number) => () => onRemoveUploadFile(index);

  return (
    <Grid container gap={2} alignItems="flex-end">
      <Grid item>
        {(contents ?? []).length === 0 && (
          <FileUploader
            accept={accept}
            fileInfos={contents}
            multiple={multiple}
            maxFiles={maxFiles}
            onChange={onChangeUploadFile}
          />
        )}
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          {(contents ?? []).map((content, index) => {
            const acceptStr = Array.isArray(accept) ? accept.join(',') : accept;
            const isLottie = acceptStr.match(/json/) && content.extension === 'json';
            const isHls = acceptStr.match(/video/) && content.extension === 'm3u8';

            if (isLottie) {
              return (
                <LottieWrapper key={content.id ?? `file-${index}`}>
                  <LottieViewer fileInfo={content} width="80px" isPaused={isPaused} />
                  <DeleteWrapperStyled>
                    <IconButton
                      aria-label="재생 제어"
                      className="button-lottie"
                      icon={!isPaused ? <Pause /> : <PlayArrow />}
                      onClick={handleTogglePlay}
                    />
                    <Button variant="contained" color="secondary" size="small" onClick={onClickDeleteContents(index)}>
                      <DeleteIcon />
                    </Button>
                  </DeleteWrapperStyled>
                  <Box>{content.fileType}</Box>
                </LottieWrapper>
              );
            }

            if (isHls) {
              return (
                <MediaWrapperStyled
                  key={content.id ?? `file-${index}`}
                  width={multiple ? 160 : 140}
                  height={multiple ? 160 : 140}
                >
                  <ReactPlayer
                    url={`${pathConfig.cdnUrl}/${content.path}`}
                    width={multiple ? 160 : 140}
                    height={multiple ? 160 : 140}
                  />
                  <DeleteImageWrapperStyled>
                    <Button variant="contained" color="secondary" size="small" onClick={onClickDeleteContents(index)}>
                      <DeleteIcon />
                    </Button>
                  </DeleteImageWrapperStyled>
                  <Box>{content.fileType}</Box>
                </MediaWrapperStyled>
              );
            }

            return (
              <UploadMediaWithAction
                key={content.id ?? `file-${index}`}
                width={multiple ? 160 : 140}
                height={multiple ? 160 : 140}
                fileInfo={content}
                onDelete={onClickDeleteContents(index)}
                videoPlayType={content.videoPlayType}
                videoProps={{ autoPlay: false, loop: false }}
              />
            );
          })}
          <Box m="5px 0 0 -10px">
            <FormControlInput name={name} rules={{ required: requiredMessage }} sx={{ display: 'none' }} />
          </Box>
        </Box>
      </Grid>
      <UploadContentsPrimaryImageHelper helperLabels={helperLabels} />
    </Grid>
  );
};

const LottieWrapper = styled(Box)`
  display: flex;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 10px;
  column-gap: 10px;
`;

const DeleteWrapperStyled = styled(Box)`
  display: flex;
  flex-direction: column;

  > button {
    min-width: 40px;
    min-height: 40px;
    border-radius: 10px;
  }
`;

const DeleteImageWrapperStyled = styled(Box)`
  position: absolute;
  right: 5px;
  bottom: 5px;

  > button {
    min-width: 40px;
    min-height: 40px;
    border-radius: 10px;
  }
`;

const MediaWrapperStyled = styled(Box)<{ width: number; height: number }>`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: ${({ width }) => width || 120}px;
  height: ${({ height }) => height || 120}px;
  margin: 20px 10px 0 0;
  overflow: hidden;
  border: 1px solid #eee;
  border-radius: 20px;
  outline: none;
  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
