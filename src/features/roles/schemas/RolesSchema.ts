/**
 * 카테고리별 권한 리스트 아이템 스키마
 */
export interface RoleItemSchema {
  id: number;
  name: string;
  granted: boolean;
  description: string;
}

/**
 * 카테고리별 권한 리스트 스키마
 */
export interface RoleCategorySchema {
  id: number;
  name: string;
  roles: RoleItemSchema[];
}

/**
 * 권한 정보 스키마
 */
export interface RolesSchema {
  isRoot: boolean;
  name: string;
  providerId: number;
  menus: RoleCategorySchema[];
}
