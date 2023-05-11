import { ComponentMeta, ComponentStory } from '@storybook/react';
import { toMenuPermissions, toPermissionNavSections } from '@models/MenuModel';
import { menusApi } from '../__fakeApi__/menuApi';
import { NavSections } from './NavSections';
import { sections } from '../menus';

export default {
  title: 'Components/NavSections',
  component: NavSections,
} as ComponentMeta<typeof NavSections>;

const getPermissions = async () => toMenuPermissions(await menusApi.getMenusTree());

const Template: ComponentStory<typeof NavSections> = (args, { loaded: { sections } }) => (
  <NavSections {...args} sections={sections} />
);

export const 전체_권한 = Template.bind({});
전체_권한.args = {
  pathname: '/member',
};
전체_권한.loaders = [
  async () => ({
    sections: toPermissionNavSections(sections, await getPermissions()),
  }),
];

export const 일부_권한 = Template.bind({});
일부_권한.args = {
  pathname: '/provider/list',
};
일부_권한.loaders = [
  async () => ({
    sections: toPermissionNavSections(
      sections,
      (await getPermissions()).filter((pairKey) => pairKey.includes('provider')),
    ),
  }),
];
