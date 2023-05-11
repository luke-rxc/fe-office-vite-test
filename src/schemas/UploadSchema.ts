import type { UploadFileType } from '@services/useFileUploader';

export interface UploadSchema {
  width?: number;
  height?: number;
  fileType?: UploadFileType;
  id: number;
  path: string;
  extension: string;
  originalFileName?: string;
  fileSize?: number;
  thumbnail?: UploadFileSchema;
  thumbnailImage?: UploadFileSchema;
  mp4?: UploadFileSchema;
  hls?: UploadFileSchema;
  blurHash?: string;
  /** @deprecated mp4 로 변경, 21.12.15 이후라면 삭제 */
  video720p?: UploadFileSchema;
}

export interface UploadFileSchema {
  width?: number;
  height?: number;
  id: number;
  path: string;
  extension: string;
}
