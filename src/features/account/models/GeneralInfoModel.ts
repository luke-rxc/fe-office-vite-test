import { GeneralInfoSchema, AuthoritySchema, AuthorityMenuSchema, AuthorityMenuRolesSchema } from '../schemas';

export type GeneralInfoModel = GeneralInfoSchema;
export type GeneralDetailModel = Pick<GeneralInfoSchema, 'companyName' | 'name' | 'cellPhone' | 'partName'>;

interface AuthorityRoleListModel {
  label: string;
}
export interface AuthorityModel extends AuthoritySchema {
  roleList?: AuthorityRoleListModel[];
}

export const toGeneralDetail = (data: GeneralInfoSchema): GeneralDetailModel => {
  const { name, companyName, partName, cellPhone } = data ?? {};
  return { name: name ?? '', companyName: companyName ?? '', partName: partName ?? '', cellPhone: cellPhone ?? '' };
};

export const toAuthority = (data: AuthoritySchema): AuthorityModel => {
  if (data) {
    const { menus, ...otherData } = data;
    const roleList = menus.reduce((prev: AuthorityModel['roleList'], current: AuthorityMenuSchema) => {
      const { roles } = current;
      const inRoles = roles
        .filter(({ granted }: AuthorityMenuRolesSchema) => granted)
        .map(({ description }: AuthorityMenuRolesSchema) => ({
          label: description,
        }));
      return prev.concat(inRoles);
    }, []);

    return {
      ...otherData,
      menus,
      roleList,
    };
  }

  return data;
};
