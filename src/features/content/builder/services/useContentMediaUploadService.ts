import { useFormContext } from 'react-hook-form';
import { UploadDomainType, UploadFileType, useFileUploader } from '@services/useFileUploader';
import { getIsImageType } from '@utils/files';
import { FormContentMediaModel, FormContentMediaUploadModel, MediaFileListModel } from '../models';
import { FORM_KEY } from '../constants';

/**
 * 미디어 파일 업로드
 * @returns
 */
export const useContentMediaUploadService = () => {
  const { handleUpload: handleFileUpload } = useFileUploader({
    domainType: UploadDomainType.STORY,
    blurHash: true,
    sound: true,
  });
  const { setValue, getValues } = useFormContext();

  /**
   * 미디어 파일 업로드 실행
   * - 파일 업로드 후 폼 데이터 contents에 정보 업데이트
   * @param fileList
   * @returns
   */
  const handleMediaUpload = async (fileList: MediaFileListModel[]) => {
    await fileList.reduce(async (promise, mediaFile) => {
      await promise.then();
      const { id: componentId, key, index, file } = mediaFile; // 대상 미디어 파일 관련 정보
      const fileInfo = await handleFileUpload([file]); // 파일 업로드 실행

      // 업로드 성공시, form contents key에 미디어 결과 정보 업데이트
      if (fileInfo.length > 0) {
        // const { id: fileId, width, height, path, fileType, extension, file, thumbnail, mp4,  } = fileInfo[0]; // 파일 결과 정보
        const { id: fileId, width, height, path, fileType, extension, file, blurHash, thumbnail, mp4 } = fileInfo[0]; // 파일 결과 정보
        const isVideo = fileType === UploadFileType.VIDEO;
        // 비디오인 경우, 트랜스코딩 된 비디오 정보를 사용한다.
        const updatedFileInfo = {
          path: isVideo ? mp4?.path : path,
          width: isVideo ? mp4?.width : width,
          height: isVideo ? mp4?.height : height,
          id: isVideo ? mp4?.id : fileId,
          fileType: fileType ? fileType : getIsImageType(extension) ? UploadFileType.IMAGE : UploadFileType.VIDEO,
          extension,
          file,
          thumbnail: thumbnail?.path ?? '',
          blurHash: blurHash ?? '',
        };

        const commonMediaInfo = {
          id: updatedFileInfo.id,
          path: updatedFileInfo.path,
          width: updatedFileInfo.width,
          height: updatedFileInfo.height,
          fileSize: file.size,
          extension: updatedFileInfo.extension,
          blurHash: updatedFileInfo.blurHash,
        };

        const contentsFormInfo = getValues(`${componentId}.${FORM_KEY.CONTENTS}.${key}`);
        const uploaderFormInfo = getValues(`${componentId}.${FORM_KEY.MEDIA_UPLOADER}.${key}`);

        /**
         * form 대상 key에 파일 정보 업데이트
         */
        if (index !== null) {
          // form 대상 key의 값이 배열인 경우 (미디어 리스트 형태)
          const newUploaderFormInfo = [...uploaderFormInfo];
          const newContentsFormInfo = [...contentsFormInfo];

          // 미디어 업로더 데이터
          newUploaderFormInfo[index] = {
            ...commonMediaInfo,
            file: null, // 파일 객체를 삭제하여 미디어 재업로드 되지 않도록 null 처리
            fileType: updatedFileInfo.fileType,
          };
          // 컨텐츠 데이터 - 파일 결과 정보를 업데이트 한다.
          newContentsFormInfo[index] = {
            ...commonMediaInfo,
            posterImage: updatedFileInfo.thumbnail,
            type: updatedFileInfo.fileType,
          };

          // 폼 - 미디어 업로더 데이터 업데이트
          setValue(`${componentId}.${FORM_KEY.MEDIA_UPLOADER}`, {
            ...getValues(`${componentId}.${FORM_KEY.MEDIA_UPLOADER}`),
            [key]: [...newUploaderFormInfo],
          });
          // 폼 - 컨텐츠 데이터 업데이트
          setValue(`${componentId}.${FORM_KEY.CONTENTS}`, {
            ...getValues(`${componentId}.${FORM_KEY.CONTENTS}`),
            [key]: [...newContentsFormInfo],
          });
        } else {
          // form 대상 key의 값이 단일 데이터인 경우

          // 미디어 업로더 데이터
          const newUploaderFormInfo: FormContentMediaUploadModel = {
            ...uploaderFormInfo,
            ...commonMediaInfo,
            file: null, // 파일 객체를 삭제하여 미디어 재업로드 되지 않도록 null 처리
            fileType: updatedFileInfo.fileType,
          };
          // 컨텐츠 데이터 - 파일 결과 정보를 업데이트 한다.
          const newContentsFormInfo: FormContentMediaModel = {
            ...contentsFormInfo,
            ...commonMediaInfo,
            posterImage: updatedFileInfo.thumbnail,
            type: updatedFileInfo.fileType,
          };

          // 폼 - 미디어 업로더 데이터 업데이트
          setValue(`${componentId}.${FORM_KEY.MEDIA_UPLOADER}`, {
            ...getValues(`${componentId}.${FORM_KEY.MEDIA_UPLOADER}`),
            [key]: newUploaderFormInfo,
          });
          // 폼 - 컨텐츠 데이터 업데이트
          setValue(`${componentId}.${FORM_KEY.CONTENTS}`, {
            ...getValues(`${componentId}.${FORM_KEY.CONTENTS}`),
            [key]: newContentsFormInfo,
          });
        }
      }
      return Promise.resolve([]);
    }, Promise.resolve([]));
  };

  return {
    handleMediaUpload,
  };
};
