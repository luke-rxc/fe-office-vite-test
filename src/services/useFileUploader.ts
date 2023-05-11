import { useState } from 'react';
import { useMutation } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { uploadFile } from '@apis/uploadFile';
import { UploadFileInfo, UploadFileResponse } from '@models/UploadModel';

export const UploadDomainType = {
  STORY: 'STORY',
  SHOWROOM: 'SHOWROOM',
  BRAND: 'BRAND',
  GOODS: 'GOODS',
  PROVIDER: 'PROVIDER',
  COUPON: 'COUPON',
  HOME: 'HOME',
  LIVE: 'LIVE',
  SCHEDULE: 'SCHEDULE',
  DISCOVER: 'DISCOVER',
  RAFFLE: 'RAFFLE',
} as const;

export const UploadFileType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  ETC: 'ETC',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UploadFileType = typeof UploadFileType[keyof typeof UploadFileType];

/**
 * 동영상 play type
 */
export const VideoPlayType = {
  /** Autoplay 기반 한번만 재생 */
  ONCE: 'ONCE',
  /** Autoplay 기반 무한 반복 */
  REPEAT: 'REPEAT',
  /** Autoplay 를 하지 않음 */
  DEFAULT: 'DEFAULT',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VideoPlayType = typeof VideoPlayType[keyof typeof VideoPlayType];

export const VideoPlayTypeLabel: {
  [k in VideoPlayType]: string;
} = {
  [VideoPlayType.ONCE]: '한번만',
  [VideoPlayType.REPEAT]: '반복',
  [VideoPlayType.DEFAULT]: '자동재생하지 않음',
};

export interface FileUploaderProps {
  domainType: keyof typeof UploadDomainType;
  initFileInfos?: UploadFileInfo[];
  blurHash?: boolean;
  /** 인코딩시 음성 추가 */
  sound?: boolean;
}

/**
 * File 객체 내에서의 type 을 기준으로 Upload File Type 을 정의
 *
 * @param {string} type
 * @return {UploadFileType}
 * @description 22.01.05 update
 * - svg type 경우에 원래 image/svg+xml 타입으로 저장되어 있어, IMAGE 타입이 맞으나,
 *   서버(백엔드)에서 처리시, 이미지 타입인 경우는 blurhash 처리가 이루어지기 때문에 이를 방지하고자,
 *   ETC 타입으로 변경하여 처리함
 */
const getFileType = (type: string): UploadFileType => {
  if (/^video/.test(type)) {
    return UploadFileType.VIDEO;
  }

  if (/^image/.test(type)) {
    return /^image\/svg/.test(type) ? UploadFileType.ETC : UploadFileType.IMAGE;
  }

  return UploadFileType.ETC;
};

export const useFileUploader = ({ domainType, initFileInfos, blurHash = false, sound = false }: FileUploaderProps) => {
  const [fileInfos, setFileInfos] = useState(initFileInfos || []);
  const {
    mutateAsync: mutateFileUpload,
    error: fileUploadError,
    isLoading: isLoadingUploadContent,
    isError: isErrorUploadContent,
    isSuccess: isSuccessUploadContent,
  } = useMutation<UploadFileResponse, ErrorModel, FormData, unknown>(uploadFile);

  /**
   * 업로드할 파일 선택시 (after file browse)
   *
   * @param {UploadFileInfo[]} updateFiles 업로드 할 파일 객체들
   * @param {boolean} [isOverwrite=false] 기존 fileInfo 에 합치는 게 아니라, 새로 fileInfo 로 갱신 (multiple 모드가 아닐때 사용)
   */
  const handleUpdateFileInfo = (updateFiles: UploadFileInfo[], isOverwrite = false) => {
    const updateFileInfos = isOverwrite ? updateFiles : fileInfos.concat(updateFiles);
    setFileInfos(updateFileInfos);
  };

  /**
   * fileInfos 내 삭제
   *
   * @param {number} index index 번호
   */
  const handleRemove = (index: number) => {
    const updateFileInfos = [...fileInfos.slice(0, index), ...fileInfos.slice(index + 1)];
    setFileInfos(updateFileInfos);
    return updateFileInfos;
  };

  /**
   * fileInfos 초기화
   */
  const handleRemoveAll = () => {
    setFileInfos([]);
  };

  /**
   * fileInfos 내에서 위치 Swapping (sourceIdx, targetIdx 의 위치를 변경)
   *
   * @param {number} sourceIdx
   * @param {number} targetIdx
   */
  const handleSwap = (sourceIdx: number, targetIdx: number) => {
    if (sourceIdx < 0 || targetIdx < 0) {
      throw new Error('[useFileUploader] handleSwap: sourceIdx 와 targetIdx는 0보다는 커야 합니다.');
    }
    [fileInfos[sourceIdx], fileInfos[targetIdx]] = [fileInfos[targetIdx], fileInfos[sourceIdx]];
    setFileInfos([...fileInfos]);
  };

  /** fileInfos 내의 위치를 최상단으로 이동 */
  const handleMoveTop = (idx: number) => {
    const duplicateFileInfos = fileInfos.slice();
    const moveData = duplicateFileInfos[idx];
    duplicateFileInfos.splice(idx, 1);
    duplicateFileInfos.unshift(moveData);
    setFileInfos([...duplicateFileInfos]);
  };

  /** fileInfos 내의 위치를 최하단으로 이동 */
  const handleMoveBottom = (idx: number) => {
    const duplicateFileInfos = fileInfos.slice();
    const moveData = duplicateFileInfos[idx];
    duplicateFileInfos.splice(idx, 1);
    duplicateFileInfos.push(moveData);
    setFileInfos([...duplicateFileInfos]);
  };

  /**
   * 실제 서버 파일 업로드
   *
   * @param {UploadFileInfo[]} [uploadFileInfos=fileInfos] 인자가 없다면 저장되어 있는 fileInfos 를 기준으로 진행
   * @return {UploadFileInfo[]} fileInfos
   */
  const handleUpload = async (uploadFileInfos = fileInfos) => {
    const fileInfos = await uploadFileInfos.reduce(async (promise, info) => {
      const result: UploadFileInfo[] = await promise.then();

      const formData = new FormData();
      const fileType = getFileType(info.file.type);
      formData.append('domainType', domainType);
      formData.append('fileType', fileType);
      formData.append('file', info.file);
      formData.append('blurHash', `${blurHash}`);
      formData.append('sound', `${sound}`);

      const uploadInfos: UploadFileResponse = await mutateFileUpload(formData);
      result.push({
        ...info,
        ...uploadInfos,
      });

      return Promise.resolve(result);
    }, Promise.resolve([] as UploadFileInfo[]));

    return fileInfos;
  };

  return {
    fileInfos,
    fileUploadError,
    isErrorUploadContent,
    isSuccessUploadContent,
    isLoadingUploadContent,
    handleSwap,
    handleMoveTop,
    handleMoveBottom,
    handleUpdateFileInfo,
    handleUpload,
    handleRemove,
    handleRemoveAll,
  };
};
