import { menuTree } from '@apis/menu';
import { toMenuPermissions, toPermissionNavSections } from '@models/MenuModel';
import { useMutation } from './useMutation';
import { sections } from '../menus';

export const useMenu = () => {
  const { mutateAsync: requestMenuTree } = useMutation(menuTree);

  const getPermissions = async () => toMenuPermissions(await requestMenuTree());

  const getMappedNavSections = (permissions: string[]) => toPermissionNavSections(sections, permissions);

  return {
    getPermissions,
    getMappedNavSections,
  };
};
