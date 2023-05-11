import { baseApiClient } from '@utils/api';
import type { ComboType } from '../constants';
import type { ComboListSchema } from '../schemas';

export const getComboList = (type: ComboType): Promise<ComboListSchema> =>
  baseApiClient.get<ComboListSchema>(`/common/combo/${type}`);
