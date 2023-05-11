import { UploadSchema } from '@schemas/UploadSchema';
import { UploadFileType, VideoPlayType } from '@services/useFileUploader';

export type UploadFileResponse = UploadSchema;
export interface UploadFileInfo extends Partial<UploadFileResponse> {
  file?: File;
  /**
   * file type
   */
  fileType?: UploadFileType;
  /**
   * 동영상 재생타입
   */
  videoPlayType?: VideoPlayType | null;
}
