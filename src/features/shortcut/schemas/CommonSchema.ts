import { UploadFileType } from '@services/useFileUploader';
import { MediaFileType } from '../constants';

/**
 * 이미지 schema
 */
export interface ImageSchema {
  id: number;
  path: string;
  originalFileName: string;
  extension: string;
  width: number;
  height: number;
  fileType?: UploadFileType;
}

/**
 * media schema
 */
export interface MediaSchema {
  fileSize: number;
  fileType: MediaFileType;
  id: number;
  path: string;
  originalFileName: string;
  extension: string;
  width: number;
  height: number;
  thumbnailImage: ImageSchema;
}
