/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import axios from 'axios';
import Lottie, { LottieProps } from 'react-lottie';
import { pathConfig } from '@config';
import { ArrayElement, FileFieldValue } from '../../types';

export interface LottieViewerProps extends Omit<LottieProps, 'options'> {
  /** 파일 정보 */
  fileInfo: ArrayElement<FileFieldValue>;
  /** 로디 옵션 */
  options?: Omit<LottieProps['options'], 'animationData'>;
}

/**
 * 로띠 뷰어 컴포넌트
 */
export const LottieViewer: React.FC<LottieViewerProps> = ({ fileInfo, options, isPaused, ...props }) => {
  const { cdnUrl } = pathConfig;
  const [autoplay] = useState<boolean>(!isPaused);
  const [animationData, setAnimationData] = useState<any>();

  /**
   * react-lottie에서 src로 재생할 수 있는 기능이 없어 json data를 load 후
   * react-lottie에 전달해야 하기 때문에 비동기로 데이터 로드 처리
   */
  React.useEffect(() => {
    (async () => {
      try {
        const url = fileInfo.file ? URL.createObjectURL(fileInfo.file) : `${cdnUrl}/${fileInfo.path}`;
        const { data } = await axios({ url, method: 'get', responseType: 'json' });

        data && setAnimationData(data);
      } catch (error) {}
    })();
  }, [fileInfo]);

  return animationData ? (
    <Lottie isPaused={isPaused} options={{ animationData, autoplay, ...options }} {...props} />
  ) : null;
};
