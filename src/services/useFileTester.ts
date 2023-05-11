import { useState } from 'react';
import { useMutation } from 'react-query';
import { uploadFile } from '@apis/uploadFile';
import { UploadFileInfo, UploadFileResponse } from '@models/UploadModel';

export const UploadDomainType = {
  STORY: 'STORY',
  BRAND: 'BRAND',
  GOODS: 'GOODS',
  PROVIDER: 'PROVIDER',
} as const;

export const UploadFileType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  ETC: 'ETC',
} as const;

export interface FileUploaderProps {
  domainType: keyof typeof UploadDomainType;
  initFileInfos?: UploadFileInfo[];
}

const testUrl = [
  'http://www.akiii.co.kr/shopimages/akiiikr/0140010001473.gif?1625122752',
  'https://rxc.co.kr/assets/index_bg_l.jpg',
  'https://shop-phinf.pstatic.net/20201130_284/1606718949728GXe9Q_JPEG/best_review_smartstore_06.jpg',
  'https://shop-phinf.pstatic.net/20210609_151/1623217478018LQsSi_JPEG/24353320531838967_1204127764.jpg?type=m510',
  'https://shop-phinf.pstatic.net/20210603_208/1622709107781Kell1_JPEG/23844887503272913_1836691630.jpg?type=m510',
];

const getFileType = (type: string): keyof typeof UploadFileType => {
  return /^video/.test(type) ? UploadFileType.VIDEO : /^image/.test(type) ? UploadFileType.IMAGE : UploadFileType.ETC;
};

export const useFileTester = ({ domainType, initFileInfos }: FileUploaderProps) => {
  const [fileInfos, setFileInfos] = useState(initFileInfos || []);
  const { mutateAsync: mutateFileUpload, isLoading: isLoadingUploadContent } = useMutation(uploadFile);

  const handleUpdateFileInfo = (updateFiles: UploadFileInfo[], isOverwrite = false) => {
    const updateFileInfos = isOverwrite ? updateFiles : fileInfos.concat(updateFiles);
    setFileInfos(updateFileInfos);
  };

  const handleRemove = (index: number) => {
    setFileInfos([...fileInfos.slice(0, index), ...fileInfos.slice(index + 1)]);
  };

  const handleRemoveAll = () => {
    setFileInfos([]);
  };

  const handleSort = (sourceIdx: number, targetIdx: number) => {
    if (sourceIdx < 0 || targetIdx < 0) {
      throw new Error('[useFileUploader] handleSort: sourceIdx 와 targetIdx는 0보다는 커야 합니다.');
    }
    [fileInfos[sourceIdx], fileInfos[targetIdx]] = [fileInfos[targetIdx], fileInfos[sourceIdx]];
    setFileInfos([...fileInfos]);
  };

  const handleUpload = async (uploadFileInfos = fileInfos) => {
    console.log('[handleUploadServer]file', uploadFileInfos);

    const fileInfos = await uploadFileInfos.reduce(async (promise, info) => {
      const result: UploadFileInfo[] = await promise.then();
      const formData = new FormData();
      const fileType = getFileType(info.file.type);
      formData.append('domainType', domainType);
      formData.append('fileType', fileType);
      /* formData.append('width', '');
      formData.append('height', ''); */

      formData.append('file', info.file);
      const res: UploadFileResponse = await mutateFileUpload(formData);
      result.push({
        ...info,
        ...res,
      });

      /* const testStrUrl = testUrl[Math.floor(Math.random() * testUrl.length)];
      console.log('testStrUrl', testStrUrl);
      const res2: UploadFileResponse = {
        s3Path: testStrUrl,
        id: Math.random() * 100,
        width: 0,
        height: 0,
      }; */

      /* result.push({
        ...info,
        ...res2,
      }); */

      return Promise.resolve(result);
    }, Promise.resolve([] as UploadFileInfo[]));

    return fileInfos;
  };

  // console.log('[useFileUploader] fileInfo', fileInfos);

  return {
    fileInfos,
    isLoadingUploadContent,
    handleSort,
    handleUpdateFileInfo,
    handleUpload,
    handleRemove,
    handleRemoveAll,
  };
};
