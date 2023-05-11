import { ProviderSchema } from '../schemas/ProviderSchema';

export type ProviderModel = ProviderSchema;

export const toProviderModel = (item: ProviderSchema): ProviderModel => {
  return { ...item };
};

export const toProviderModelList = (items: Array<ProviderSchema>): Array<ProviderModel> => {
  return items.map(toProviderModel);
};
