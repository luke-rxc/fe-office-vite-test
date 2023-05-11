import { RoleItemSchema, RoleCategorySchema, RolesSchema } from './RolesSchema';
/**
 * 콤보 박스용 입점사 리스트 아이템 스키마
 */
export interface ProviderComboItemSchema {
  id: number;
  name: string;
}

/**
 * 콤포박스용 입점사 리스트 스키마
 */
export interface ProviderComboListSchema {
  items: ProviderComboItemSchema[];
}

/**
 * 입점사 리스트 아이템
 */
export interface ProviderItemSchema extends RolesSchema {}

/**
 * 입점사 리스트
 */
export type ProviderListSchema = ProviderItemSchema[];

/**
 * 입점사 권한 카테고리
 */
export interface ProviderRoleCategorySchema extends RoleCategorySchema {}

/**
 * 입점사 카테고리별 권한 아이템
 */
export interface ProviderRoleItemSchema extends RoleItemSchema {}
