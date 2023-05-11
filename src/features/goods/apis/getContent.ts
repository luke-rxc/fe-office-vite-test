import { baseApiClient } from '@utils/api';
import { ContentSchema } from '../schemas';
import { ApiDomain, GoodsContentType } from '../constants';

interface ContentRequestParams {
  type: GoodsContentType;
  goodsId: string;
}

export const getContentList = ({ type, goodsId }: ContentRequestParams): Promise<ContentSchema[]> => {
  const pathSuffix = type === GoodsContentType.MAIN.toLowerCase() ? 'images' : 'components';
  return baseApiClient.get<ContentSchema[]>(`${ApiDomain.Goods}/${goodsId}/${pathSuffix}`);
};
