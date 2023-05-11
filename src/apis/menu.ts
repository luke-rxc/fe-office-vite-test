import type { MenuTreeSchema } from '@schemas/MenuSchema';
import { baseApiClient } from '@utils/api';

export const menuTree = (): Promise<MenuTreeSchema> => {
  return baseApiClient.get<MenuTreeSchema>('/admin/menus/tree');
};
