/**
 * 미디어 파일 타입
 */
export const MediaFileType = {
  ETC: 'ETC',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MediaFileType = typeof MediaFileType[keyof typeof MediaFileType];

export const MediaFileTypeLabel: {
  [k in MediaFileType]: string;
} = {
  [MediaFileType.ETC]: '기타',
  [MediaFileType.IMAGE]: '이미지',
  [MediaFileType.VIDEO]: '동영상',
};
