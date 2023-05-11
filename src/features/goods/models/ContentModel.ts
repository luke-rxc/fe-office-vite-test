import { pathConfig } from '@config';
import { UploadFileType } from '@services/useFileUploader';
import { ContentSchema } from '../schemas';

export interface ContentModel {
  fileType: UploadFileType;
  path: string;
  width: number;
  height: number;
  extension: string;
  id: number;
}

const { cdnUrl } = pathConfig;
const toContentModel = (item: ContentSchema): ContentModel => {
  const { file } = item;
  const { path, fileType, width, height, extension, id } = file;
  return {
    fileType,
    path: `${cdnUrl}/${path}`,
    width,
    height,
    extension,
    id,
  };
};

export const toContentModelList = (items: ContentSchema[]): ContentModel[] => {
  return items.map(toContentModel);
};
