import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { UseFormReturn } from 'react-hook-form';
import findIndex from 'lodash/findIndex';
import { GoodsKind } from '@constants/goods';
import { useQuery } from '@hooks/useQuery';
import { getTicketList, getTicketGroupList, getTicketGoodsList } from '../apis';
import { QueryKey } from '../constants';
import { TicketSchema, TicketGroupSchema, TicketGoodsSchema } from '../schemas';
import {
  toTicketModelList,
  toTicketGroupModelList,
  toTicketGoodsModelList,
  TicketGoodsModel,
  StateModel,
  TicketInfoModel,
} from '../models';

interface Props {
  methods: UseFormReturn<StateModel>;
  enabledNormalTicket?: boolean;
  enabledAgentTicket?: boolean;
}

export const useTicketService = ({ methods, enabledNormalTicket = false, enabledAgentTicket = false }: Props) => {
  const queryClient = useQueryClient();
  // 선택한 티켓 연동 id
  const [selectedTicketAgentId, setSelectedTicketAgentId] = useState<number>(null);
  const [selectedTicketAgentList, setSelectedTicketAgentList] = useState<TicketGoodsModel[]>(null);

  // 선택한 티켓 그룹 id
  const [ticketAgentList, setTicketAgentList] = useState<any>(null);

  // 선택한 티켓 정보
  const [selectedTicketInfo, setSelectedTicketInfo] = useState<TicketInfoModel | null>(null);
  const { getValues } = methods;

  // 티켓 일반
  const {
    data: ticketNormalList,
    isLoading: isTicketNormalListLoading,
    isError: isTicketNormalListError,
  } = useQuery([QueryKey.TicketNormalList], () => getTicketList(GoodsKind.TICKET_NORMAL), {
    select: (data: TicketSchema[]) => {
      return toTicketModelList(data ?? []);
    },
    retry: 3,
    enabled: enabledNormalTicket,
  });

  // 티켓 연동(그룹)
  const {
    data: ticketAgentGroupList,
    isLoading: isTicketAgentGroupListLoading,
    isError: isTicketAgentGroupListError,
  } = useQuery([QueryKey.TicketAgentGroupList], () => getTicketGroupList(GoodsKind.TICKET_AGENT), {
    select: (data: TicketGroupSchema[]) => {
      return toTicketGroupModelList(data ?? []);
    },
    retry: 3,
    enabled: enabledAgentTicket,
  });

  const getTicketAgentList = (ticketId: number) => {
    return queryClient.getQueryData([QueryKey.TicketAgentGoodsList, ticketId]) as TicketGoodsModel[];
  };

  const isTicketAgentList = (ticketId: number) => {
    return !!getTicketAgentList(ticketId);
  };

  // 티켓 상품 연동
  const {
    data: ticketAgentGoodsList,
    isLoading: isTicketAgentGoodsListLoading,
    isError: isTicketAgentGoodsListError,
  } = useQuery(
    [QueryKey.TicketAgentGoodsList, selectedTicketAgentId],
    () => getTicketGoodsList(selectedTicketAgentId),
    {
      select: (data: TicketGoodsSchema[]) => {
        return toTicketGoodsModelList(data ?? []);
      },
      enabled: selectedTicketAgentId !== null && !isTicketAgentList(selectedTicketAgentId),
    },
  );

  // 티켓 연동 내 연결되어 있는 상품 연동
  const handleSelectTicketAgent = () => {
    const goodsKind = getValues('goodsKind');
    const ticketId = getValues('ticketId');

    if (ticketId && goodsKind === GoodsKind.TICKET_AGENT) {
      setSelectedTicketAgentId(+ticketId);
      if (isTicketAgentList(+ticketId)) {
        setSelectedTicketAgentList(getTicketAgentList(+ticketId));
      }
      return;
    }

    // reset
    if (selectedTicketAgentId) {
      setSelectedTicketAgentId(null);
      setSelectedTicketAgentList(null);
    }
  };

  // 티켓 연동 내 그룹 선택
  const handleSelectTicketAgentGroup = () => {
    const ticketGroupId = getValues('ticketGroupId');
    const idx = findIndex(ticketAgentGroupList ?? [], (list) => list.value === ticketGroupId);

    if (idx !== -1) {
      const ticketList = ticketAgentGroupList[idx].tickets ?? [];
      setTicketAgentList([...toTicketModelList(ticketList)]);
    }
  };

  // 티켓 정보 변경시
  /** @todo 상품정보 수정시 마지막에 null로 들어오는 이슈 체크 */
  const handleSelectTicketInfo = (ticketInfo: TicketInfoModel | null) => {
    setSelectedTicketInfo(ticketInfo);
  };

  useEffect(() => {
    if (ticketAgentGoodsList) {
      setSelectedTicketAgentList(ticketAgentGoodsList);
    }
  }, [ticketAgentGoodsList]);

  return {
    ticketNormalList: ticketNormalList ?? [],
    ticketAgentList: ticketAgentList ?? [],
    ticketAgentGroupList: ticketAgentGroupList ?? [],
    selectedTicketAgentId,
    selectedTicketAgentList,
    selectedTicketInfo,
    isTicketNormalListLoading,
    isTicketNormalListError,
    isTicketAgentGroupListLoading,
    isTicketAgentGroupListError,
    isTicketAgentGoodsListLoading,
    isTicketAgentGoodsListError,
    handleSelectTicketAgent,
    handleSelectTicketAgentGroup,
    handleSelectTicketInfo,
  };
};
