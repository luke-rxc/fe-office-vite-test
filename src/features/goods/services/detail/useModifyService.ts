import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useLoading from '@hooks/useLoading';
import { GoodsKind } from '@constants/goods';
import { usePageType } from '../../hooks';
import { validationModifySchema, validationPartnerModifySchema } from '../../utils';
import { initialState } from '../../models';
import { useLink } from '../../hooks';
import { DialogFeedbackLabel } from '../../constants';
import { useDialogService } from '..';

// services
import { useModifyGetGoodsService } from './useModifyGetGoodsService';
import { useModifySubmitService } from './useModifySubmitService';
import { useRequestLogService } from './useRequestLogService';
import { useCommissionService } from './useCommissionService';
import { useMdServices, useKeywordService, useProviderService, useManagerService, useTicketService } from '..';

export const useModifyService = () => {
  const { isPartnerSite } = usePageType();
  const { errorDialog } = useDialogService();
  const methods = useForm({
    defaultValues: { ...initialState },
    resolver: yupResolver(isPartnerSite ? validationPartnerModifySchema : validationModifySchema),
    reValidateMode: 'onBlur',
  });

  /** base hook */
  const { navigateGoodsMain } = useLink();
  const { showLoading, hideLoading } = useLoading();
  // change goods kind
  const [selectedGoodsKind, setSelectedGoodsKind] = useState<GoodsKind>(GoodsKind.REAL);

  /** Get: 상품 상세 정보 조회 */
  const { detailListItem, isDetailListLoading, isDetailListError } = useModifyGetGoodsService({ methods });

  /** md 정보 */
  const { mdList: mdListOptions, isMdListLoading, isMdListError } = useMdServices({ enabled: !isPartnerSite });

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
    isProviderListLoading,
    isProviderListError,
    selectedProviderInfo,
    setSelectedProviderInfo,
    handleSelectProvider,
  } = useProviderService({
    enabled: !isPartnerSite,
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
  } = useTicketService({
    methods,
    enabledNormalTicket: !isPartnerSite,
    enabledAgentTicket: !isPartnerSite,
  });

  /** 요청(판매,수정)에 대한 로그 정보 */
  const { requestLogItem, isRequestLogLoading, isRequestLogError } = useRequestLogService();

  /** 수수료 */
  const { selectedCommission, handleUpdateCommission } = useCommissionService({
    selectedProviderInfo,
  });

  /** Put: Submit */
  const {
    handleSaveSubmit,
    handlePartnerSaleRequest,
    handleManagerApproval,
    handleDebug,
    partnerRequestMemoDialog,
    managerRejectMemoDialog,
  } = useModifySubmitService({
    methods,
    requestId: detailListItem?.requestId ?? null,
  });

  /** Loading */
  const isContentLoaded =
    !isDetailListLoading &&
    !!detailListItem &&
    !isMdListLoading &&
    !isKeywordListLoading &&
    !isProviderListLoading &&
    !isManagerListLoading &&
    !isRequestLogLoading &&
    !isTicketNormalListLoading &&
    !isTicketAgentGroupListLoading;

  /** Error */
  const isContentError =
    isDetailListError ||
    isMdListError ||
    isKeywordListError ||
    isProviderListError ||
    isManagerListError ||
    isRequestLogError ||
    isTicketNormalListError ||
    isTicketAgentGroupListError;

  useEffect(() => {
    if (detailListItem) {
      const { providerName, providerId, commissionRate, goodsKind } = detailListItem;

      // 입점사 정보 동기화
      if (providerName) {
        setSelectedProviderInfo({
          label: providerName,
          value: providerId,
          commissionRate: commissionRate,
        });
      }

      // 상품 분류 동기화
      if (goodsKind) {
        setSelectedGoodsKind(goodsKind);
      }

      // 상품 분류가 티켓 연동일 때 데이터 로드
      if (goodsKind === GoodsKind.TICKET_AGENT) {
        handleSelectTicketAgent();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailListItem]);

  useEffect(() => {
    if (isContentError) {
      errorDialog({
        label: DialogFeedbackLabel.LOAD_GOODS,
        closeCb: () => {
          navigateGoodsMain();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentError]);

  useEffect(() => {
    isContentLoaded || isContentError ? hideLoading() : showLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentLoaded, isContentError]);

  return {
    methods,
    isContentLoaded,
    // 상품 상세 정보
    detailListItem,
    // Goods Kind
    selectedGoodsKind,
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
    // Commission
    selectedCommission,
    handleUpdateCommission,
    // 로그 정보
    requestLogItem,
    // Submit
    handleSaveSubmit,
    handleDebug,
    // 파트너 : 승인요청
    handlePartnerSaleRequest,
    // 매니저 : 승인요청
    handleManagerApproval,
    // 파트너 : 승인요청 메모
    partnerRequestMemoDialog,
    // 매니저 : 승인 & 반려 요청
    managerRejectMemoDialog,
  };
};
