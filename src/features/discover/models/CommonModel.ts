import { pathConfig } from '@config';
import { ImageSchema } from '../schemas';

/**
 * 이미지 model
 */
export interface ImageModel extends ImageSchema {
  fullPath: string;
}

/**
 * 디스커버 이미지 schema => 디스커버 이미지 model convert
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
