export interface MemberSchema {
  id: number;
  email: string;
  nickName: string;
  name: string;
  phone: string;
  isIdentify: boolean;
  isAdult: boolean;
  status: {
    code: string;
    name: string;
  };
  createdDate: number;
  lastLoginDate: number;
  ssoConnect: string;
}
