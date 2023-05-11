import { RolesSchema } from './RolesSchema';

/**
 * 초대 상세 정보 스키마
 */
export interface InvitationInfoSchema {
  id: number;
  email: string;
  name: string;
  companyName: string;
  partName: string;
  cellPhone: string;
  createdDate: number;
  roles: RolesSchema;
}
