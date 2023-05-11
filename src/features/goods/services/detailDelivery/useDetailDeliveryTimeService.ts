import { useEffect } from 'react';
import { useQuery } from '@hooks/useQuery';
import { useFormContext } from 'react-hook-form';
import { DetailDeliveryDailySchema } from '../../schemas';
import { getDeliveryDaily } from '../../apis';
import { toDeliveryDailyList } from '../../models';
import { QueryKey } from '../../constants';

interface Props {
  initDeliveryTodayEndTime?: string;
}

export const useDetailDeliveryTimeService = ({ initDeliveryTodayEndTime }: Props) => {
  const { setValue } = useFormContext();

  // 당일 발송시 시간 리스트
  const { data: dailyTimeLists, isLoading: isDailyTimeListLoading } = useQuery(
    [QueryKey.Detail.DeliveryTime],
    async () => {
      const res: DetailDeliveryDailySchema = await getDeliveryDaily();
      return res;
    },
    {
      select: (data) => toDeliveryDailyList(data.goodsDeliveryEndTimes),
      /**
       * @since 230411
       * @issue 오피스 상품관리 내 상품상세에서 당일발송 마감시간 Cache 있을때의 이슈
       * - 기존 상품상세에서 상품을 조회하고, 다른 메뉴 내에서 같은 상품 조회시, 이미 캐시된 데이터를 내려주는 과정에서 렌더링 이슈 발생 (이미 선택되어 있는 부분이 표시가 안됨)
       * @todo 우선 react-query 의 cacheTime 조정으로 진행하고, 추후 해당 렌더링 구조 개선 필요
       */
      cacheTime: 0,
    },
  );

  useEffect(() => {
    if (initDeliveryTodayEndTime && !isDailyTimeListLoading) {
      setValue('deliveryTodayEndTime', initDeliveryTodayEndTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initDeliveryTodayEndTime, isDailyTimeListLoading]);

  return {
    dailyTimeLists: dailyTimeLists || [],
  };
};
