import { useQuery } from '@hooks/useQuery';
import { usePageType } from '../../hooks';
import { getGoodsRequestLog } from '../../apis';
import { QueryKey } from '../../constants';
import { toGoodsRequestLogList } from '../../models';

export const useRequestLogService = () => {
  const { id: goodsId } = usePageType();
  const {
    data: requestLogItem,
    isLoading: isRequestLogLoading,
    isError: isRequestLogError,
  } = useQuery(
    [QueryKey.Detail.RequestLog, goodsId],
    async () => {
      const res = await getGoodsRequestLog(goodsId);
      return res;
    },
    {
      select: (data) => toGoodsRequestLogList(data),
    },
  );

  return {
    requestLogItem,
    isRequestLogLoading,
    isRequestLogError,
  };
};
