import type { ReactNode } from 'react';
import { baseMenuPermissions } from '@constants/menu';
import { MenuTreeSchema, MenuTreeItemSchema } from '@schemas/MenuSchema';

/**
 * 권한 정보를 갖고 있는 Section Model
 */
export interface PermissionSectionModel {
  pairKey: string;
  path?: string;
  icon?: ReactNode;
  info?: ReactNode;
  children?: PermissionSectionModel[];
  title: string;
}

/**
 * 권한 정보를 갖고 있는 Sections Model
 */
export interface PermissionSectionsModel {
  pairKey: string;
  title: string;
  items: PermissionSectionModel[];
}

/**
 * Menus Tree의 nested key를 추출하여 pairKey 배열 생성
 */
export const toMenuPermissions = (data: MenuTreeSchema): string[] => {
  const reducePermissions = (items: MenuTreeItemSchema[], prefix: string = '') => {
    return items.reduce((acc, { key, children }) => {
      const pairKey = prefix ? prefix.concat('.', key) : key;

      acc.push(pairKey);

      children?.length && acc.push(...reducePermissions(children, pairKey));

      return acc;
    }, []);
  };

  const { menus } = data;

  return baseMenuPermissions.concat(reducePermissions(menus));
};

interface ReduceNavSections {
  pairKey: string;
  title: string;
  items?: PermissionSectionModel[];
  children?: PermissionSectionModel[];
}

/**
 * Navigation Sections를 권한 기준으로 생성
 */
export const toPermissionNavSections = (sections: PermissionSectionsModel[], permissions: string[]) => {
  const reduceNavSections = (items: ReduceNavSections[]) => {
    return items.reduce((acc, { pairKey, items, children, ...other }) => {
      if (!permissions.includes(pairKey)) {
        return acc;
      }

      items && acc.push({ ...other, items: reduceNavSections(items) });

      children && acc.push({ ...other, children: reduceNavSections(children) });

      !(items || children) && acc.push({ ...other });

      return acc;
    }, []);
  };

  return reduceNavSections(sections);
};
