import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useLoading from '@hooks/useLoading';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { QueryKey, BulkType } from '../../constants';
import { getBulkDetail } from '../../apis';
import { toBulkDetail } from '../../models';
import { BulkDetailTableType, toBulkDetailTable } from '../../types';
import { useBulkHeaderService } from '..';

interface Props {
  id: string;
}
export const useBulkDetailService = ({ id }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [bookDetailTable, setBookDetailTable] = useState<BulkDetailTableType[]>(null);
  const [bulkDetailType, setBulkDetailType] = useState<BulkType>(null);

  /** API : Header 기준 조회 */
  const { bulkHeaders, isBulkHeaderLoading } = useBulkHeaderService();

  /**
   * API : 상세 조회
   */
  const { data: bulkDetailInfo, isLoading: isInfoLoading } = useQuery(
    [QueryKey.BulkDetail, id],
    () => getBulkDetail(id),
    {
      select: (data) => toBulkDetail(data),
      onError: (error: ErrorModel) => {
        toast.error(error.data.message ?? '조회가 실패하였습니다.\r\n다시 한번 시도해 주세요');
      },
    },
  );

  useEffect(() => {
    if (bulkHeaders && bulkDetailInfo) {
      const { headers, goods } = bulkDetailInfo;
      const { entries: bulkHeaderEntries } = bulkHeaders;

      /** @todo goods-mapping 케이스 체크 필요 */
      setBulkDetailType(goods ? BulkType.BASE : BulkType.OPTION);
      setBookDetailTable(toBulkDetailTable(bulkHeaderEntries, headers));
    }
  }, [bulkHeaders, bulkDetailInfo]);

  useEffect(() => {
    setIsPageLoading(isBulkHeaderLoading || isInfoLoading);
  }, [isBulkHeaderLoading, isInfoLoading]);

  useEffect(() => {
    isPageLoading ? showLoading() : hideLoading();
  }, [isPageLoading, showLoading, hideLoading]);

  return {
    isPageLoading,
    bulkDetailType,
    bulkDetailInfo,
    bookDetailTable,
  };
};
