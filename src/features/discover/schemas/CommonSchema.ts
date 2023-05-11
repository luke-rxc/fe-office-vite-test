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
}
