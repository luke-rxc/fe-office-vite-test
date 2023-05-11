import { CONTENT_TYPE, CONTENT_STATUS_TYPE } from '../constants';

export type ContentDefaultSchema = {
  adminUserId: number;
  code: string;
  createdDate: number;
  id: number;
  keywords: { id: number; name: string }[];
  name: string;
  providerId: number;
  publicEndDate: number;
  publicStartDate: number;
  showRoomId: 1;
  showRoomName: string;
  status: CONTENT_STATUS_TYPE;
  type: CONTENT_TYPE;
  updatedDate: number;
  primaryImage: {
    extension: string;
    height: number;
    id: number;
    path: string;
    width: number;
  } | null;
};
