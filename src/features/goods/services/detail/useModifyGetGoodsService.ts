import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@hooks/useQuery';
import { ErrorModel } from '@utils/api/createAxios';
import toast from 'react-hot-toast';
import { getGoodsDetail } from '../../apis';
import { usePageType } from '../../hooks';
import { QueryKey, CommonDetailMessage } from '../../constants';
import { toGoodsInfo, toGoodsFormData, initialState, StateModel } from '../../models';
import { log } from '../../utils';

interface Props {
  methods: UseFormReturn<StateModel>;
}

export const useModifyGetGoodsService = ({ methods }: Props) => {
  const { id: goodsId } = usePageType();
  const isInitRef = useRef(false);
  const { reset } = methods;
  const {
    data: detailListItem,
    isLoading: isDetailListLoading,
    isError: isDetailListError,
  } = useQuery(
    [QueryKey.Detail.ListItem, goodsId],
    async () => {
      const res = await getGoodsDetail(goodsId);
      return res;
    },
    {
      select: (data) => toGoodsInfo(data),
      onError: (error: ErrorModel) => {
        toast.error(error?.data?.message ?? CommonDetailMessage.FAIL_LOAD_GOODS);
      },
      cacheTime: 0,
    },
  );

  useEffect(() => {
    log('detailListItem', detailListItem);
    // form value에 대한 연산 & Reset은 처음 값을 받은 후 한번만 진행
    if (!!detailListItem && !isInitRef.current) {
      const convertedDetailList = toGoodsFormData(detailListItem);
      reset({
        ...initialState,
        ...convertedDetailList,
      });
      isInitRef.current = true;
    }
  }, [reset, detailListItem]);

  return {
    detailListItem,
    isDetailListLoading,
    isDetailListError,
  };
};
