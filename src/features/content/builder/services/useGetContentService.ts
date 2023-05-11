import { useCallback } from 'react';
import { useParams } from 'react-router';
import { useQueryClient } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { QUERY_KEY } from '../constants';
import { getContent } from '../apis';
import { ContentSchema } from '../schemas';
import { toContentModel } from '../models';

/**
 * 컨텐츠 데이터 조회
 * @returns
 */
export const useGetContentService = () => {
  const client = useQueryClient();
  const { id } = useParams();
  const {
    data: content,
    isError,
    isSuccess,
  } = useQuery(
    [QUERY_KEY.CONTENT, id],
    async () => {
      const res = await getContent(id);
      return res;
    },
    {
      select: (data: ContentSchema) => {
        return toContentModel(data);
      },
    },
  );

  const handleInvalidateQuery = useCallback(() => {
    client.invalidateQueries([QUERY_KEY.CONTENT, id]);
  }, [client, id]);

  return {
    isSuccess,
    isError,
    content,
    handleInvalidateQuery,
  };
};
