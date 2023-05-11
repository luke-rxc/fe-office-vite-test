import { UploadSchema } from '@schemas/UploadSchema';
import { VideoPlayType } from '@services/useFileUploader';

// 대표, 상세 컨텐츠 Schema 공통
export interface ContentSchema {
  file: UploadSchema;
  /**
   * 동영상 재생타입
   */
  videoPlayType?: VideoPlayType | null;
}
