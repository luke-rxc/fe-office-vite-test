import toast from 'react-hot-toast';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { toBulkHeader } from '../models';
import { getExportBulkHeader } from '../apis';
import { QueryKey, BulkMessage } from '../constants';

/**
 * API : Header 기준 조회
 */
export const useBulkHeaderService = () => {
  const {
    data: bulkHeaders,
    isLoading: isBulkHeaderLoading,
    isError: isBulkHeaderError,
  } = useQuery([QueryKey.BulkHeader], getExportBulkHeader, {
    select: (data) => toBulkHeader(data),
    onError: (error: ErrorModel) => {
      toast.error(error?.data?.message ?? BulkMessage.FAIL_LOAD_HEADER);
    },
  });

  return {
    bulkHeaders,
    isBulkHeaderLoading,
    isBulkHeaderError,
  };
};
