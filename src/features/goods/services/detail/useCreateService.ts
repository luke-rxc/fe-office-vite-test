import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoodsKind } from '@constants/goods';
import { usePageType } from '../../hooks';
import { validationCreateSchema, validationPartnerCreateSchema } from '../../utils';
import { initialState } from '../../models';
import { PageLoadStatus } from '../../constants';

// services
import { useCreateSubmitService } from './useCreateSubmitService';
import { useCommissionService } from './useCommissionService';
import { useDetailTemporaryService } from '../detailTemp';
import {
  useMdServices,
  useKeywordService,
  useProviderService,
  useManagerService,
  usePartnerProviderService,
  useTicketService,
} from '..';

export const useCreateService = () => {
  const { isPartnerSite } = usePageType();

  /** 파트너 : 선택한 입점사 정보 */
  const { providerInfo: partnerProviderInfo } = usePartnerProviderService();

  // initialize State
  const [pageLoadState, setPageLoadState] = useState<PageLoadStatus>(PageLoadStatus.LOADING);

  // change goods kind
  const [selectedGoodsKind, setSelectedGoodsKind] = useState<GoodsKind>(GoodsKind.REAL);

  // 임시 저장 된 리스트 로드 상태인지 여부
  const [isTempListLoadStatus, setIsTempListLoadStatus] = useState(false);

  const methods = useForm({
    defaultValues: { ...initialState },
    resolver: yupResolver(isPartnerSite ? validationPartnerCreateSchema : validationCreateSchema),
    reValidateMode: 'onBlur',
  });

  /** Create: Submit */
  const { handleSaveSubmit, handleDebug } = useCreateSubmitService({
    methods,
    partnerProviderId: isPartnerSite ? partnerProviderInfo.id : null,
  });

  /** 임시 저장 */
  const { temporaryList, tempListItem, handleSaveTemporary, handleLoadTemporaryList, handleDeleteTempMutate } =
    useDetailTemporaryService({
      methods,
    });

  /** md 정보 */
  const {
    mdList: mdListOptions,
    isMdListLoading,
    isMdListError,
  } = useMdServices({
    enabled: !isPartnerSite,
  });

  /** 담당자 정보 */
  const {
    managerList: managerListOptions,
    isManagerListLoading,
    isManagerListError,
  } = useManagerService({
    enabled: !isPartnerSite,
  });

  /** keyword 정보 */
  const {
    keywordList: keywordListOptions,
    isKeywordListLoading,
    isKeywordListError,
  } = useKeywordService({
    enabled: !isPartnerSite,
  });

  /** 입점사 정보 */
  const {
    providerLists: providerListOptions,
    selectedProviderInfo,
    isProviderListLoading,
    isProviderListError,
    setSelectedProviderInfo,
    handleSelectProvider,
  } = useProviderService({
    enabled: !isPartnerSite,
    /** 파트너 오피스 : 등록모드에서 로그인 기반의 Provider 정보를 주입 */
    initSelectedProviderInfo:
      partnerProviderInfo !== null
        ? {
            label: partnerProviderInfo.name,
            value: partnerProviderInfo.id,
            commissionRate: partnerProviderInfo.commissionRate,
          }
        : null,
  });

  /** 티켓 정보 */
  const {
    ticketNormalList: ticketNormalListOptions,
    ticketAgentList: ticketAgentListOptions,
    ticketAgentGroupList: ticketAgentGroupListOptions,
    selectedTicketAgentId,
    selectedTicketAgentList,
    selectedTicketInfo,
    isTicketNormalListLoading,
    isTicketNormalListError,
    isTicketAgentGroupListLoading,
    isTicketAgentGroupListError,
    handleSelectTicketAgent,
    handleSelectTicketAgentGroup,
    handleSelectTicketInfo,
  } = useTicketService({ methods, enabledNormalTicket: !isPartnerSite, enabledAgentTicket: !isPartnerSite });

  /** 수수료 */
  const { selectedCommission, handleUpdateCommission } = useCommissionService({
    selectedProviderInfo,
  });

  /** 상품 분류 변경 */
  const handleChangeGoodsKind = (goodsKind: GoodsKind) => {
    setSelectedGoodsKind(goodsKind);
  };

  /**
   * 임시 저장 리스트 로드 후 상태 값들의 처리
   */
  useEffect(() => {
    if (tempListItem) {
      const { providerName, providerId, commissionRate, goodsKind } = tempListItem ?? {};
      // 입점사 정보 동기화
      if (providerName) {
        setSelectedProviderInfo({
          label: providerName,
          value: providerId,
          commissionRate: commissionRate,
        });
      }
      // 상품 분류 동기화
      if (selectedGoodsKind !== goodsKind) {
        handleChangeGoodsKind(goodsKind);
      }

      // 상품 분류가 티켓(연동)이라면 티켓 정보 동기화
      if (goodsKind === GoodsKind.TICKET_AGENT) {
        handleSelectTicketAgent();
      }

      // 임시 저장 로드 상태 저장
      setIsTempListLoadStatus(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempListItem]);

  /**
   * 임시 저장 리스트 로드 후 임시 저장 상태라는 부분을 해제 시켜주는 처리
   */
  useEffect(() => {
    // 임시 저장 로드 완료 상태 저장
    if (selectedGoodsKind !== GoodsKind.TICKET_AGENT || selectedTicketAgentList) {
      setIsTempListLoadStatus(false);
    }
  }, [selectedGoodsKind, selectedTicketAgentList]);

  /**
   * initialize 처리
   */
  useEffect(() => {
    if (isMdListError || isManagerListError || isProviderListError || isKeywordListError) {
      setPageLoadState(PageLoadStatus.ERROR);
      return;
    }

    if (isMdListLoading || isManagerListLoading || isProviderListLoading || isKeywordListLoading) {
      setPageLoadState(PageLoadStatus.LOADING);
      return;
    }

    setPageLoadState(PageLoadStatus.COMPLETE);
  }, [
    isMdListLoading,
    isMdListError,
    isManagerListLoading,
    isManagerListError,
    isKeywordListLoading,
    isKeywordListError,
    isProviderListLoading,
    isProviderListError,
    isTicketNormalListLoading,
    isTicketNormalListError,
    isTicketAgentGroupListLoading,
    isTicketAgentGroupListError,
  ]);

  return {
    methods,
    pageLoadState,
    // Goods Kind
    selectedGoodsKind,
    // 임시 저장
    temporaryList,
    tempListItem,
    handleSaveTemporary,
    handleLoadTemporaryList,
    handleDeleteTempMutate,
    // md 정보
    mdListOptions,
    // 담당자 정보
    managerListOptions,
    // keyword 정보
    keywordListOptions,
    // 입점사 정보
    providerListOptions,
    selectedProviderInfo,
    setSelectedProviderInfo,
    handleSelectProvider,
    // 티켓 정보
    ticketNormalListOptions,
    ticketAgentListOptions,
    ticketAgentGroupListOptions,
    selectedTicketAgentId,
    selectedTicketAgentList,
    selectedTicketInfo,
    handleSelectTicketAgent,
    handleSelectTicketAgentGroup,
    handleSelectTicketInfo,
    handleChangeGoodsKind,
    // Commission
    selectedCommission,
    handleUpdateCommission,
    // Temp List Status
    isTempListLoadStatus,
    // Submit
    handleSaveSubmit,
    handleDebug,
  };
};
