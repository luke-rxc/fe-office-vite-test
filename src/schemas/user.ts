/**
 * 사용자 타입(매니저, 입점사)
 */
export type UserType = 'MANAGER' | 'PARTNER';

/**
 * 사용자 정보 내 Provider 정보
 */
interface UserProviderSchema {
  id: number;
  name: string;
  commissionRate: number;
}

/**
 * 사용자 schema
 */
export interface UserSchema {
  active: boolean;
  email: string;
  type: UserType;
  userId: number;
  provider: UserProviderSchema;
  /**
   * template에 사용중인 필드로 추후 삭제예정
   * @deprecated
   */
  [key: string]: any;
}

export interface AuthToken {
  providerId: number;
  providerName: string;
  token: string;
}

/**
 * 인증 Token schema
 */
export interface AuthTokenSchema {
  id: number;
  principalType: UserType;
  tokens: Array<AuthToken>;
}
