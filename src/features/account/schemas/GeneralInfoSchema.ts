// 현재 토큰(세션) 기반 권한조회 > menus > roles
export interface AuthorityMenuRolesSchema {
  id: number;
  name: string;
  description: string;
  granted: boolean;
}

// 현재 토큰(세션) 기반 권한조회 > menus
export interface AuthorityMenuSchema {
  id: number;
  name: string;
  roles: AuthorityMenuRolesSchema[];
}

// 현재 토큰(세션) 기반 권한조회
export interface AuthoritySchema {
  isRoot: boolean;
  providerId: number;
  name: string;
  menus: AuthorityMenuSchema[];
}

// 내 관리자 정보 상세 조회
export interface GeneralInfoSchema {
  id: number;
  email: string;
  principalType: 'MANAGER' | 'PARTNER';
  name: string | null;
  partName: string;
  companyName: string;
  cellPhone: string;
  passwordChangeDate: number | null;
  lastLoginDate: number;
  createdDate: number;
  updatedDate: number | null;
  otpEnable: boolean;
  enabled: boolean;
}
