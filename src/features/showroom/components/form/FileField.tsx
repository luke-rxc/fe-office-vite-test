/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import last from 'lodash/last';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import fileUploadImage from '@assets/images/files.svg';
import { Box, Grid, Typography } from '@material-ui/core';
import { DeleteForeverSharp, PlayArrow, Pause, InvertColors, InvertColorsOff } from '@material-ui/icons';
import { IconButton } from '@components/IconButton';
import { UploadMedia } from '@components/uploader/UploadMedia';
import { FileUploader, FileUploaderProps } from '@components/uploader/FileUploader';
import { FileFieldValue, ArrayElement } from '../../types';
import { LottieViewer } from '../base';

const isVideoType = (fileInfo: ArrayElement<FileFieldValue>) => {
  if (fileInfo?.file) {
    return !!fileInfo.file?.type.match('video');
  }

  if (fileInfo?.fileType) {
    return fileInfo.fileType === 'VIDEO';
  }

  return false;
};

export interface FileFieldProps extends Omit<FileUploaderProps, 'render' | 'fileInfos'> {
  /** input의 label 역할 */
  title?: React.ReactNode;
  /** 파일 필드의 설명 */
  descriptions?: React.ReactNode;
  /**
   * 파일 데이터 목록
   *
   * 하나의 파일만 선택 가능하지만 배열 타입을 사용하는 이유는 공통 FileUploader 컴포넌트에서
   * 배열 타입으로 파일 데이터를 받는 점과 react-hook-form에서 object 값을 사용하는 경우
   * 새로운 값으로 덮어쓰기가 아닌 머지되기 때문에 배열을 사용
   */
  fileInfos?: FileFieldValue;
  error?: boolean;
  className?: string;
}

/**
 * 스타일링된 FileField 컴포넌트
 */
export const FileField = styled(
  ({ title, descriptions, fileInfos, disabled, className, onChange, error, ...props }: FileFieldProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // 배경 적용 여부
    const [isThumbBg, setThumbBgStatus] = useState(false);
    // 로띠/video 재생 여부
    const [isPlayed, setPlayStatus] = useState(false);

    /**
     * 파일 데이터
     */
    const fileInfo = first(fileInfos);

    /**
     * 삭제 가능 여부
     */
    const deletable = !isEmpty(fileInfos) && !disabled;

    /**
     * 파일명
     */
    const fileName = fileInfo ? (fileInfo?.file ? fileInfo.file.name : fileInfo.originalFileName) : '';

    /**
     * 로띠 파일 여부 (json 파일은 무조건 로띠파일로 간주한다)
     */
    const isLottie = fileInfo && (last(fileInfo.path?.split('.')) === 'json' || /\/json$/.test(fileInfo.file?.type));

    /**
     * 비디오 파일 여부
     */
    const isVideo = isVideoType(fileInfo);

    /**
     * 파일 타입
     * @todo media타입을 image | video로 상세 구분 작업 필요
     */
    const fileType = fileInfo ? (isLottie ? 'lottie' : 'media') : 'null';

    /**
     * 선택된 파일 제거
     */
    const handleRemove = () => onChange([]);

    /**
     * Thumbnail 배경색 토글
     */
    const handleToggleBg = () => setThumbBgStatus((curr) => !curr);

    /**
     * 로띠, 비디오 재생/일시정지 제어
     */
    const handleTogglePlay = () => {
      setPlayStatus((played) => {
        if (isVideo && containerRef.current) {
          const video = containerRef.current.querySelector('video');

          if (video) {
            played ? video.pause() : video.play();
          }
        }

        return !played;
      });
    };

    /**
     * 2022.07.20 기준으로 운영에서 로띠파일(편성표 타이틀 로고)은 100% 흰색만 사용하고 있어
     * 디폴트로 배경색이 보이도록 설정
     */
    useEffect(() => {
      if (isLottie && !isThumbBg) {
        setThumbBgStatus(true);
      }
    }, [isLottie]);

    /**
     * 비디오타입 초기 재생 설정
     */
    useEffect(() => {
      if (isVideo && containerRef.current) {
        const video = containerRef.current.querySelector('video');
        if (video) {
          video.autoplay = isPlayed;
          video.loop = true;
          video.load();
        }
      }
    }, [isVideo]);

    return (
      <Box className={className} ref={containerRef}>
        <FileUploader
          fileInfos={fileInfos}
          sx={{ width: '100%', height: 'auto', border: 0 }}
          onChange={onChange}
          {...props}
          render={() => (
            <Grid container className="file-container">
              <Grid item minWidth={250} md={2} xs={12}>
                {/* 파일 썸네일 */}
                <Box className="file-thumb">
                  <Box className={`inner ${isThumbBg ? 'is-bg' : ''}`}>
                    {fileType === 'null' && <img src={fileUploadImage} alt="" />}
                    {fileType === 'media' && <UploadMedia fileInfo={fileInfo} />}
                    {fileType === 'lottie' && <LottieViewer fileInfo={fileInfo} isPaused={!isPlayed} />}
                  </Box>
                  {/* 파일명 */}
                  {fileName && <Typography className="name" variant="caption" children={fileName} />}
                </Box>
              </Grid>

              {/* 파일 정보 */}
              <Grid item md xs={12}>
                <Box className="file-info">
                  {title && <Typography color="textPrimary" variant="h6" component="div" children={title} />}
                  {descriptions && <Typography color="textPrimary" component="div" children={descriptions} />}
                </Box>
              </Grid>
            </Grid>
          )}
        />
        {deletable && (
          <IconButton
            color="secondary"
            aria-label="선택 취소"
            className="button-delete"
            onClick={handleRemove}
            icon={<DeleteForeverSharp />}
          />
        )}

        {(isLottie || isVideo) && (
          <IconButton
            aria-label="재생 제어"
            className="button-lottie"
            icon={isPlayed ? <Pause /> : <PlayArrow />}
            onClick={handleTogglePlay}
          />
        )}

        <IconButton
          aria-label="배경 전환"
          className="button-background"
          icon={isThumbBg ? <InvertColorsOff /> : <InvertColors />}
          onClick={handleToggleBg}
        />
      </Box>
    );
  },
)`
  position: relative;
  width: 100%;
  height: auto;
  border: ${({ theme, error }) => `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;

  .button-delete {
    position: absolute;
    top: ${({ theme }) => theme.spacing(2)};
    right: ${({ theme }) => theme.spacing(1)};
  }

  .button-lottie {
    position: absolute;
    top: ${({ theme }) => theme.spacing(2)};
    left: ${({ theme }) => theme.spacing(1)};
  }

  .button-background {
    position: absolute;
    bottom: ${({ theme }) => theme.spacing(2)};
    right: ${({ theme }) => theme.spacing(1)};
  }

  & > div {
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

    & > div:hover {
      opacity: 1;
    }
  }

  .file-container {
    padding: ${({ theme }) => theme.spacing(1)};

    & > div {
      display: inline-flex;
    }

    .file-thumb {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin: 0 auto;

      .inner {
        min-width: 150px;
      }

      .inner.is-bg {
        background: ${({ theme }) => theme.palette.divider};
      }

      & img,
      & video {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 150px;
        max-height: 150px;
        object-fit: contain !important;
      }

      .name {
        margin-top: 5px;
        text-align: center;
      }
    }

    .file-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: ${({ theme }) => theme.spacing(3)};
      opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    }
  }
`;
