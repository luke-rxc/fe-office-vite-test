/**
 * 초대 리스트 스키마
 */
export type InvitationListSchema = Array<InvitationItemSchema>;

/**
 * 초대 리스트 아이템 스키마
 */
export interface InvitationItemSchema {
  id: number;
  companyName: string;
  createdDate: number;
  invitationUserEmail: string;
  email: string;
  name: string;
  partName: string;
  /** 초대 상태 */
  status: 'ACTIVE' | 'INVITATION';
  /** 초대 상태 label */
  statusName: '가입 대기중' | '활성화 대기';
}
