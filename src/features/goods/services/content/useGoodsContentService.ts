import { useEffect } from 'react';
import { useQuery } from '@hooks/useQuery';
import useLoading from '@hooks/useLoading';
import { GoodsContentType, QueryKey } from '../../constants';
import { toContentModelList } from '../../models';
import { getContentList } from '../../apis';

interface Props {
  type: GoodsContentType;
  goodsId: string;
}

export const useGoodsContentService = ({ type, goodsId }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const {
    data: contentList,
    isLoading,
    isError,
  } = useQuery([QueryKey.Content, type, goodsId], () => getContentList({ type, goodsId }), {
    select: (data) => toContentModelList(data),
    enabled: !!type && !!goodsId,
  });

  useEffect(() => {
    isLoading ? showLoading() : hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return {
    contentList: contentList ?? [],
    isLoading,
    isError,
  };
};
