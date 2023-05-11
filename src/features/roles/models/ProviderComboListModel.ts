import { ProviderComboItemSchema } from '../schemas';

/**
 * 입점사 모델
 */
export type ProviderComboItemModel = ProviderComboItemSchema;

/**
 * 입점사 리스트 모델
 */
export type ProviderComboListModel = ProviderComboItemModel[];

/**
 * [api <-> ui] 선택된 입점사 데이터만 반환
 */
export const toSelectedProviderComboItemsModel = (
  providerIds: (string | number)[],
  providerList: ProviderComboListModel,
) => {
  return providerList.filter(({ id }) => providerIds.indexOf(id) > -1);
};

/**
 * [api <-> ui] 입점사 리스트에서 id만 추출
 */
export const toProviderComboIdsModel = (providerComboList: ProviderComboListModel) => {
  return providerComboList.map(({ id }) => id);
};
