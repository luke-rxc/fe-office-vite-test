import { baseApiClient } from '@utils/api';
import { PaginationResponse } from '@schemas/PaginationSchema';
import { GoodsListSchema, BulkExportSchema } from '../schemas';
import { ListSearchRequestParams, PartnerListSearchRequestParams } from '../models';
import { ApiDomain, BulkType } from '../constants';

interface SearchRequestParams {
  goodsSearchRequest: ListSearchRequestParams;
  page: number;
  size: number;
  sort: string;
}

interface PartnerSearchRequestParams extends Omit<SearchRequestParams, 'goodsSearchRequest'> {
  goodsSearchRequest: PartnerListSearchRequestParams;
}

/** [RequestParams] delete, copy */
interface UpdateRequestParams {
  goodsId: number;
}

interface ListBulkDownloadRequestParams extends ListSearchRequestParams {
  headers: string[];
}

/** 검색 리스트 */
export const getGoods = async ({
  goodsSearchRequest,
  page,
  size,
  sort,
}: SearchRequestParams): Promise<PaginationResponse<GoodsListSchema>> => {
  return baseApiClient.post<PaginationResponse<GoodsListSchema>>(
    `${ApiDomain.Goods}/search?page=${page}&size=${size}&sort=${sort}`,
    {
      ...goodsSearchRequest,
    },
  );
};

/** 검색 리스트 : 파트너 */
export const getPartnerGoods = async ({
  goodsSearchRequest,
  page,
  size,
  sort,
}: PartnerSearchRequestParams): Promise<PaginationResponse<GoodsListSchema>> => {
  return baseApiClient.post<PaginationResponse<GoodsListSchema>>(
    `${ApiDomain.Goods}/search?page=${page}&size=${size}&sort=${sort}`,
    {
      ...goodsSearchRequest,
    },
  );
};

/** 리스트 삭제 */
export const deleteGoods = async ({ goodsId }: UpdateRequestParams) => {
  return baseApiClient.delete(`${ApiDomain.Goods}/${goodsId}`);
};

/** @todo naming issue
 * https://www.notion.so/Office-665b2d72683548799c84b38ac0aa2edb
 */
/** 리스트 복제 */
export const copyGoods = async ({ goodsId }: UpdateRequestParams) => {
  return baseApiClient.post(`${ApiDomain.Goods}/${goodsId}/copy`);
};

const getBulkUrl = (type: BulkType) => {
  if (type === BulkType.OPTION) {
    return 'bulk-option';
  }

  if (type === BulkType.MAPPING) {
    return 'bulk-goods-mapping';
  }

  return 'bulk-goods-base';
};

/** 일괄 상품 서식 다운로드 항목 조회 */
export const postExportBulk = async (downloadType: BulkType, params: ListBulkDownloadRequestParams) => {
  const urlSuffix = getBulkUrl(downloadType);
  return baseApiClient.post<BulkExportSchema>(`/v1${ApiDomain.Goods}/bulk-update/export/${urlSuffix}`, params);
};
