import { pathConfig } from '@config';
import { MediaFileTypeLabel } from '../constants';
import { ImageSchema, MediaSchema } from '../schemas';

/**
 * 이미지 model
 */
export interface ImageModel extends ImageSchema {
  fullPath: string;
}

/**
 * media model
 */
export interface MediaModel extends MediaSchema {
  fullPath: string;
  fileTypeLabel: string;
}

/**
 * 메인 이미지 schema => 메인 이미지 model convert
 */
export const toImageModel = (item: ImageSchema): ImageModel => {
  if (!item) {
    return null;
  }

  return {
    ...item,
    fullPath: item.path ? `${pathConfig.cdnUrl}/${item.path}` : null,
  };
};

/**
 * 메인 media schema => 메인 media model convert
 */
export const toMediaModel = (item: MediaSchema): MediaModel => {
  if (!item) {
    return null;
  }

  return {
    ...item,
    fullPath:
      item.fileType === 'VIDEO'
        ? item.thumbnailImage?.path
          ? `${pathConfig.cdnUrl}/${item.thumbnailImage.path}`
          : null
        : item.path
        ? `${pathConfig.cdnUrl}/${item.path}`
        : null,
    fileTypeLabel: MediaFileTypeLabel[item.fileType],
  };
};
