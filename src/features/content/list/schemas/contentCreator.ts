export type ContentCreatorSchema = {
  adminUserId: number;
  code: string;
  contentsType: string;
  createdDate: string;
  id: number;
  keywords: {
    id: number;
    name: string;
  }[];
  name: string;
  providerId: number;
  publicEndDate: string;
  publicStartDate: string;
  showRoomId: number;
  showRoomName: string;
  status: string;
  updatedDate: string;
};
