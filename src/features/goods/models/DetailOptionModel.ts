import { TicketType } from '@constants/goods';
import {
  OptTitleReqSchema,
  OptSubmitReqParamSchema,
  OptTempReqParamSchema,
  OptListReqSchema,
  OptListSchema,
  OptBaseSchema,
  TicketResSchema,
} from '../schemas';
import { OptRegisterKinds } from '../constants';
import { getRate } from '../utils';

/**
 * 옵션 리스트 Model
 */
export interface OptListModel extends OptListReqSchema {
  idx: number;
  key?: string;
  id: string;
  discountRate: number;
  ticketGoodsId?: number | string | null;
  // 티켓연동 옵션일 경우 티켓연동 내 옵션가와 옵션 등록 값이 다른지 여부
  isTicketConsumerPriceChanged?: boolean;
  isTicketPriceChanged?: boolean;
  // 옵션 내 delete 체크 (Node 제어에만 사용)
  isDeleted?: boolean;
}

// 옵션 입력 타입
export type OptBasesModel = OptBaseSchema;

export type OptionListProp = Pick<
  OptListModel,
  'option1' | 'option2' | 'option3' | 'ticketGoodsId' | 'bookingDate' | 'depositPrice'
>;

export interface OptionStateModel {
  // 옵션등록 타입 (옵션상품 등록, 단일상품 등록)
  optionRegister: OptRegisterKinds;
  // 옵션상품 등록시 옵션 입력 정보
  optionBases: OptBasesModel[];
  // 옵션상품 등록시 옵션 입력 갯수
  optionsLen: string;
  // 옵션 리스트
  optionLists: OptListModel[];
  // 옵션 타이틀
  optionTitles: string[];
}

// export type OptionsInfoProp = Pick<OptionStateModel, 'optionLists' | 'optionTitles'>;
export interface OptionsInfoProp {
  optionLists: OptListModel[];
  optionTitles: OptionStateModel['optionTitles'];
}

/**
 * 상품 등록, 수정 : Option Request Param
 */
export const toOptSubmitReqParam = (value: Partial<OptionStateModel>): OptSubmitReqParamSchema => {
  const { optionTitles, optionLists } = value;
  const optionTitle: OptTitleReqSchema = optionTitles.reduce((obj, title, index) => {
    return {
      ...obj,
      [`title${index + 1}`]: title,
    };
  }, {}) as OptTitleReqSchema;

  // isDelete 항목은 Submit 항목에서 제외
  const submitOptionLists = optionLists.filter(({ isDeleted }) => !isDeleted);
  const optionValues: OptListReqSchema[] = submitOptionLists.map(
    ({
      consumerPrice,
      discountRate,
      option1,
      option2,
      option3,
      price,
      stock,
      commissionRate,
      ticketGoodsId,
      bookingDate,
      depositPrice,
    }) => {
      const bookingRawDate = bookingDate ? new Date(bookingDate).setHours(0, 0, 0) : null;

      return {
        consumerPrice: +consumerPrice,
        discountRate: +discountRate,
        option1,
        option2: option2 ?? null,
        option3: option3 ?? null,
        price: +price,
        stock: +stock,
        commissionRate: +commissionRate,
        ticketGoodsId: ticketGoodsId ? +ticketGoodsId : null,
        depositPrice: depositPrice ? +depositPrice : null,
        bookingDate: bookingRawDate,
      };
    },
  );

  return {
    optionTitle,
    optionValues,
  };
};

/**
 * 임시저장 Option : Request Param
 */
export const toTempOptReqParam = (value: Partial<OptionStateModel>): OptTempReqParamSchema => {
  const requestOptionSubmitParam = toOptSubmitReqParam(value);
  const { optionBases } = value;
  return {
    ...requestOptionSubmitParam,
    optionBases,
  };
};

/**
 * 상품 상세 정보 Model Mapping
 * @param  {OptListSchema[]} opts
 * @param  {string[]} optTitles
 * @param  {boolean} isTempMapping=false 임시저장 모드에서의 매핑 여부
 * @returns OptListModel
 */
interface ToOptionListParams {
  opts: OptListSchema[];
  optTitles: string[];
  isTempMapping?: boolean;
  ticket?: TicketResSchema | null;
}
export const toOptionList = ({
  opts,
  optTitles,
  isTempMapping = false,
  ticket = null,
}: ToOptionListParams): OptListModel[] => {
  return opts.map((opt, idx) => {
    const {
      id,
      optionGroup,
      consumerPrice: consumerOptPrice,
      price: optPrice,
      commissionRate,
      stock,
      ticketGoods,
      bookingDate,
      depositPrice,
    } = opt;
    const optionInfos: OptionListProp = optTitles.reduce((infos, _, index) => {
      const keyName = `option${index + 1}`;
      return {
        ...infos,
        [keyName]: optionGroup[keyName],
      };
    }, {} as OptionListProp);

    // 티켓 타입 정보
    const ticketTypeId = ticket?.type?.id ?? null;

    // 예약 타입
    const isBookedTicketType = ticketTypeId
      ? [TicketType.BOOKING_DATED as string, TicketType.BOOKING_UNDATED as string].includes(ticketTypeId)
      : false;

    // 티켓가격대로 적용여부
    const isApplyTicketPrice = ticketGoods && !isBookedTicketType;

    // 티켓(연동)상품 정보 추출
    const ticketAgentConsumerPrice = isApplyTicketPrice ? ticketGoods.consumerPrice ?? null : null;
    const ticketAgentPrice = isApplyTicketPrice ? ticketGoods.price ?? null : null;

    // 실제 적용할 옵션 가격정보 추출 (티켓(연동) 옵션은 ticketGoods 를 기반으로 값을 추출)
    const consumerPrice = ticketAgentConsumerPrice ?? consumerOptPrice;
    const price = ticketAgentPrice ?? optPrice;

    // 기존에 저장된 옵션값과 티켓(연동)내 적용되어 있는 가격이 다른 경우 (상품 등록 후에 티켓(연동) 가격 정보가 변경되었을 경우 탐지)
    const isTicketConsumerPriceChanged = ticketAgentConsumerPrice
      ? ticketAgentConsumerPrice !== consumerOptPrice
      : false;
    const isTicketPriceChanged = ticketAgentPrice ? ticketAgentPrice !== optPrice : false;

    return {
      idx,
      key: null,
      id: id ? `${id}` : '',
      discountRate: getRate(consumerPrice, price),
      consumerPrice,
      price,
      commissionRate,
      stock,
      ticketGoodsId: ticketGoods ? ticketGoods?.id : null,
      isTicketConsumerPriceChanged: !isTempMapping ? isTicketConsumerPriceChanged : false,
      isTicketPriceChanged: !isTempMapping ? isTicketPriceChanged : false,
      bookingDate: bookingDate ?? null,
      depositPrice: depositPrice ?? null,
      isDeleted: false,
      ...optionInfos,
    };
  });
};
