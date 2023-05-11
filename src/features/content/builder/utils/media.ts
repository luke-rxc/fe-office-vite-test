import { DisplayMediaModel, FormContentMediaModel, FormContentMediaUploadModel } from '../models';

/**
 * 미디어 업로드 컴포넌트 초기 파일 DATA 조회
 */
export const getInitFileInfo = (
  fileInfos: Partial<FormContentMediaUploadModel> | Array<Partial<FormContentMediaUploadModel>>,
): FormContentMediaUploadModel[] => {
  if (!fileInfos) {
    return [];
  }

  if (Array.isArray(fileInfos)) {
    return [
      ...fileInfos.map((data) => {
        if (data?.file) {
          return data.file;
        } else if (data?.path) {
          return {
            id: data?.id,
            path: data?.path,
            width: data?.width,
            height: data?.height,
            fileSize: data?.fileSize,
            extension: data?.extension,
            blurHash: data?.blurHash,
            file: null,
            fileType: data?.fileType,
          };
        }
        return [];
      }),
    ];
  } else {
    return fileInfos.file
      ? [fileInfos.file]
      : fileInfos.path
      ? [
          {
            id: fileInfos?.id,
            path: fileInfos?.path,
            width: fileInfos?.width,
            height: fileInfos?.height,
            fileSize: fileInfos?.fileSize,
            extension: fileInfos?.extension,
            blurHash: fileInfos?.blurHash,
            file: null,
            fileType: fileInfos?.fileType,
          },
        ]
      : [];
  }
};

/**
 *
 * 폼 데이터 값 할당시 content, mediaUpload 키 내 미디어 초기 값
 * @returns
 */
export const getFormMediaInfo = (
  media: DisplayMediaModel | DisplayMediaModel[],
): {
  mediaContents: FormContentMediaModel | FormContentMediaModel[];
  mediaUploader: FormContentMediaUploadModel | FormContentMediaUploadModel[];
} => {
  if (Array.isArray(media)) {
    const newMediaContents = [];
    const newMediaUploaders = [];

    media.forEach((data) => {
      const commonInfo = {
        id: data?.id ?? null,
        path: data?.path ?? '',
        width: data?.width ?? 0,
        height: data?.height ?? 0,
        fileSize: data?.fileSize ?? 0,
        extension: data?.extension ?? '',
        blurHash: data?.blurHash ?? '',
      };
      const mediaContents: FormContentMediaModel = {
        ...commonInfo,
        type: data?.type ?? null,
        posterImage: data?.posterImage ?? '',
      };
      newMediaContents.push(mediaContents);

      const mediaUploader: FormContentMediaUploadModel = {
        ...commonInfo,
        file: null,
        fileType: data?.type,
      };
      newMediaUploaders.push(mediaUploader);
    });

    return {
      mediaContents: newMediaContents,
      mediaUploader: newMediaUploaders,
    };
  } else {
    const commonInfo = {
      id: media?.id ?? null,
      path: media?.path ?? '',
      width: media?.width ?? 0,
      height: media?.height ?? 0,
      fileSize: media?.fileSize ?? 0,
      extension: media?.extension ?? '',
      blurHash: media?.blurHash ?? '',
    };
    const mediaContents: FormContentMediaModel = {
      ...commonInfo,
      type: media?.type ?? null,
      posterImage: media?.posterImage ?? '',
    };

    const mediaUploader: FormContentMediaUploadModel = {
      ...commonInfo,
      file: null,
      fileType: media?.type,
    };

    return {
      mediaContents,
      mediaUploader,
    };
  }
};

/**
 * form contents 내 미디어 초기값
 * @returns
 */
export const getInitMediaContent = (): FormContentMediaModel => {
  return {
    id: null,
    path: '',
    width: 0,
    height: 0,
    fileSize: 0,
    extension: '',
    type: null,
    posterImage: '',
    blurHash: '',
  };
};
/**
 * form uploader 내 미디어 초기값
 * @returns
 */
export const getInitMediaUploader = (): FormContentMediaUploadModel => {
  return {
    id: null,
    path: '',
    width: 0,
    height: 0,
    fileSize: 0,
    extension: '',
    file: null,
    fileType: '',
    blurHash: '',
  };
};
