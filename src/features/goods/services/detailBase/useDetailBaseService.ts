import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { GoodsKind, PurchaseLimitedType, SettlementKindType } from '@constants/goods';
import { useDialog } from '@hooks/useDialog';
import { DialogType } from '@models/DialogModel';
import { useCategoryService } from '..';
import { MaxPurchaseLimit, GoodsType, PageType } from '../../constants';
import { BrandModel, CategorySelectItemModel, TicketModel, TicketInfoModel, GoodsInfoResModel } from '../../models';
import { useFormContextHelper, usePageType } from '../../hooks';
import { toDataFormatExtend } from '../../utils';

interface Props {
  initCategoryItemInfos?: CategorySelectItemModel[];
  initTicket?: GoodsInfoResModel['ticket'] | null;
  providerId: number;
  selectedGoodsKind?: GoodsKind;
  ticketNormalListOptions?: TicketModel[];
  ticketAgentListOptions?: TicketModel[];
  isTempListLoadStatus?: boolean;
  onSelectTicketAgent?: () => void;
  onSelectTicketAgentGroup?: () => void;
  onSelectTicketInfo: (ticketInfo: TicketInfoModel | null) => void;
  onChangeGoodsKind?: (goodsKind: GoodsKind) => void;
  onUpdateCommission: (commissionRate: number) => void;
}

// [categoryInfo, addCategoryInfo]
const getInitCategoriesInfos = (infos: CategorySelectItemModel[]) => {
  // init data 가 없을 때는
  if (!infos) {
    return [null, null];
  }

  const length = infos.length;
  return length === 0
    ? [null, null] // 내부 데이터가 없을때는 빈 객체를 넘겨준다
    : length === 1
    ? infos[0].primary
      ? [infos[0], null]
      : [null, infos[0]] // 1개인 경우 : category info
    : [infos[0], infos[1]]; // 모두 있는 경우, category info + addCategory info
};

export const useDetailBaseService = ({
  initCategoryItemInfos,
  initTicket,
  providerId,
  selectedGoodsKind,
  ticketNormalListOptions,
  ticketAgentListOptions,
  isTempListLoadStatus = false,
  onSelectTicketAgent: handleSelectTicketAgent,
  onSelectTicketAgentGroup: handleSelectTicketAgentGroup,
  onSelectTicketInfo: handleSelectTicketInfo,
  onUpdateCommission: handleUpdateCommission,
  onChangeGoodsKind,
}: Props) => {
  const { type: pageType } = usePageType();
  const { getValues, setValue, watch } = useFormContext();
  const { clearError } = useFormContextHelper();
  const [isBrandInit, setIsBrandInit] = useState(false);
  const { open: dialogOpen, close: dialogClose } = useDialog();
  const [initCategoryItemInfo] = getInitCategoriesInfos(initCategoryItemInfos);
  const [
    watchAlwaysDateTime,
    watchUserMaxPurchaseLimit,
    watchLimitedType,
    watchLimitedTypeYn,
    watchKcAuthYn,
    watchGoodsType,
    watchSettlementKind,
  ] = watch([
    'alwaysDateTime',
    'userMaxPurchaseLimit',
    'limitedType',
    'limitedTypeYn',
    'kcAuthYn',
    'goodsType',
    'settlementKind',
  ]);

  const { categoryInfos, isCategoryAllLoaded, handleChangeCategory } = useCategoryService({
    initCategoryItemInfo,
  });

  /** @issue v1 에서는 진행하지 않음 */
  /* const {
    categoryInfos: addCategoryInfos,
    isCategoryAllLoaded: isAddCategoryAllLoaded,
    handleChangeCategory: handleAddChangeCategory,
  } = useCategoryService({
    initCategoryItemInfo: initAddCategoryInfos,
  }); */

  /** change autocomplete : brand */
  const handleChangeBrand = (values?: BrandModel) => {
    setValue('brandInfo', values);
    setValue('brandId', values?.value);
    handleUpdateCommission(values?.commissionRate);
  };

  /** change date picker */

  /** 판매 시작일과 동일 체크 */
  const handleSameSalesTime = (isChecked: boolean) => {
    if (isChecked) {
      const startDateTime = getValues('startDateTime');
      if (!startDateTime) {
        toast.error('판매 시작일을 먼저 설정해 주세요.');
        return;
      }

      setValue('displayStartDateTime', startDateTime);
      clearError('displayStartDateTime');
    }
    setValue('sameSalesTime', isChecked);
  };

  /** 등록시 티켓정보 저장 */
  /** @todo naming method */
  const handleChangeTicket = (
    evt: React.ChangeEvent<{
      name?: string;
      value: unknown;
      event: Event | React.SyntheticEvent<Element, Event>;
    }>,
  ) => {
    const { value } = evt.target;
    const goodsKind = getValues('goodsKind');
    const ticketOptions = goodsKind === GoodsKind.TICKET_NORMAL ? ticketNormalListOptions : ticketAgentListOptions;
    const { info: ticketInfo } = ticketOptions?.find((ticket) => ticket.value === value);
    const {
      channelName,
      type: { name: typeName, id: typeId },
      periodDisplay,
    } = ticketInfo ?? {};

    /**
     * @todo 옵션 초기화 조건
     * 1. 기존 저장되어 있는 티켓 ID 와 값이 다른 경우
     * 2. 새로 저장하는 티켓 ID 가 BOOKING_DATED, BOOKING_UNDATED 인 경우
     * 3. 기존 저장하는 티켓 ID 가 BOOKING_DATED, BOOKING_UNDATED 인 경우
     */

    /* const bookingTicketTypes = [TicketType.BOOKING_DATED as string, TicketType.BOOKING_UNDATED as string];
    const isOptionReset =
      selectedTicketInfo?.typeId !== typeId &&
      (bookingTicketTypes.includes(selectedTicketInfo?.typeId ?? '') || bookingTicketTypes.includes(typeId)); */

    // 선택한 티켓 정보 저장
    handleSelectTicketInfo({ channelName, typeName, typeId, periodDisplay });

    // 티켓 타입 정보 저장
    setValue('ticketTypeId', typeId);

    // 오류 Message 삭제
    clearError('ticketId');

    // 선택한 티켓 내 상품정보 저장
    handleSelectTicketAgent();
  };

  /** 티켓 그룹 Select 변경시 */
  const handleChangeTicketGroup = () => {
    setValue('ticketId', '');
    handleSelectTicketInfo(null);
    handleSelectTicketAgentGroup();
  };

  /** 티켓 선택 UI disabled */
  const getDisabledSelectTicketUi = () => {
    if (selectedGoodsKind === GoodsKind.TICKET_NORMAL) {
      return !ticketNormalListOptions.length;
    }
    if (selectedGoodsKind === GoodsKind.TICKET_AGENT) {
      return !ticketAgentListOptions.length;
    }
    return false;
  };

  const handleChangeGoodsKind = (value: GoodsKind) => {
    const optionLists = getValues('optionLists');
    const optionListTotal = optionLists.length;
    if (optionListTotal > 0) {
      dialogOpen({
        title: '옵션 초기화',
        content: '상품 분류를 변경하면, 옵션이 초기화 됩니다.\r\n변경 하시겠습니까?',
        type: DialogType.CONFIRM,
        onClose: () => {
          setValue('goodsType', GoodsType.NORMAL);
          setValue('goodsKind', selectedGoodsKind);
          dialogClose();
        },
        onConfirm: () => {
          setValue('goodsKind', value);
          setValue('ticketId', '');
          onChangeGoodsKind?.(value);
          dialogClose();
        },
      });
      return;
    }
    setValue('goodsKind', value);
    setValue('ticketGroupId', '');
    setValue('ticketId', '');
    setValue('code', '');
    setValue('partnerExportCode', '');
    setValue('dataCollectYn', 'N');
    onChangeGoodsKind?.(value);
  };

  /**
   * 입점사 변경시, 기존 브랜드 값 초기화
   * - 초기 진행시 이미 얻었던 초기 값에 대해서는 수행하지 않는다.(첫 mount 시에는 Path)
   */
  useEffect(() => {
    if (pageType === PageType.CREATE && isBrandInit) {
      setValue('brandInfo', null);
      setValue('brandId', null);
    } else {
      setIsBrandInit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId, setValue]);

  /** 상시 판매 체크 */
  useEffect(() => {
    if (watchAlwaysDateTime) {
      // 판매시작일 당일 처리
      if (getValues('startDateTime') === '') {
        setValue('startDateTime', toDataFormatExtend(new Date().getTime()));
      }

      // 판매종료일
      setValue('endDateTime', '');
      clearError('startDateTime');
      clearError('endDateTime');
    }
  }, [watchAlwaysDateTime, getValues, setValue, clearError]);

  /** 1인 최대 구매수량 체크 */
  useEffect(() => {
    if (watchUserMaxPurchaseLimit === MaxPurchaseLimit.UNLIMIT) {
      setValue('userMaxPurchaseEa', 0);
    }
  }, [watchUserMaxPurchaseLimit, setValue]);

  /** 한정수량 체크 */
  useEffect(() => {
    if (watchLimitedType !== PurchaseLimitedType.GOODS) {
      setValue('limitedGoodsEa', 0);
    }
  }, [watchLimitedType, setValue]);

  useEffect(() => {
    if (watchLimitedTypeYn === 'N' && watchLimitedType !== PurchaseLimitedType.NONE) {
      setValue('limitedType', PurchaseLimitedType.NONE);
      clearError('limitedType');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchLimitedTypeYn]);

  /** 메인 카테고리 체크 */
  useEffect(() => {
    if (initCategoryItemInfo !== null && isCategoryAllLoaded) {
      const { one, two, three } = initCategoryItemInfo;
      setValue('category1', one ? one.id : '');
      setValue('category2', two ? two.id : '');
      setValue('category3', three ? three.id : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initCategoryItemInfo, isCategoryAllLoaded]);

  /** 상품 타입의 프리오더 변경시에는 상품 분류가 변경되므로, 상품 분류 변경 로직으로 연결 */
  useEffect(() => {
    if (watchGoodsType === GoodsType.PREORDER) {
      handleChangeGoodsKind(GoodsKind.REAL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchGoodsType]);

  /** 상품 분류가 변경될때 기존 티켓 선택 정보는 삭제 */
  useEffect(() => {
    // 임시 저장 로드시에는 초기화 되지 않도록 진행
    if (selectedGoodsKind && !isTempListLoadStatus && pageType === PageType.CREATE) {
      handleSelectTicketInfo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGoodsKind]);

  /** 상품 수정 시 초기 ticket 정보 적용 */
  useEffect(() => {
    if (initTicket && selectedGoodsKind) {
      const {
        channel: channelName,
        type: { name: typeName, id: typeId },
        period: periodDisplay,
        id: ticketId,
        groupId: ticketGroupId,
      } = initTicket;

      if (selectedGoodsKind === GoodsKind.TICKET_AGENT) {
        setValue('ticketGroupId', ticketGroupId);
        handleSelectTicketAgentGroup();
      }

      setValue('ticketId', ticketId);
      handleSelectTicketInfo({
        channelName,
        typeName,
        typeId,
        periodDisplay,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initTicket, selectedGoodsKind]);

  /** 정산벙식이 사입이 아닐경우 부가세코드등록 초기화 */
  useEffect(() => {
    if (watchSettlementKind !== SettlementKindType.BUYING) {
      setValue('vatCode', null);
      clearError('vatCode');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSettlementKind]);

  /** 추가 카테고리 체크 */
  /** @issue v1 에서는 진행하지 않음 */
  /* useEffect(() => {
    if (initAddCategoryInfos !== null && isAddCategoryAllLoaded) {
      const { one, two, three } = initAddCategoryInfos;
      setValue('addCategory1', one ? one.id : '');
      setValue('addCategory2', two ? two.id : '');
      setValue('addCategory3', three ? three.id : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initAddCategoryInfos, isAddCategoryAllLoaded]); */

  return {
    categoryInfos,
    watchAlwaysDateTime,
    watchUserMaxPurchaseLimit,
    watchLimitedType,
    watchLimitedTypeYn,
    watchKcAuthYn,
    watchGoodsType,
    watchSettlementKind,
    getDisabledSelectTicketUi,
    handleChangeCategory,
    handleSameSalesTime,
    handleChangeBrand,
    handleChangeTicket,
    handleChangeTicketGroup,
    handleChangeGoodsKind,
    /** @issue v1 에서는 진행하지 않음 */
    // addCategoryInfos,
    // handleAddChangeCategory,
  };
};
