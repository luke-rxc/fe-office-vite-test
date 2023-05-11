import * as Yup from 'yup';
import isUndefined from 'lodash/isUndefined';
import {
  LimitType as DeliveryCostType,
  GoodsKind,
  PurchaseLimitedType,
  TicketType,
  SettlementKindType,
} from '@constants/goods';
import { DeliveryType, OptRegisterKinds } from '../constants';

const YupNumberTypeRequired = (message: string): Yup.NumberSchema => {
  return Yup.number().typeError(message).required(message) as Yup.NumberSchema;
};

const YupStringTypeRequired = (message: string): Yup.StringSchema => {
  return Yup.string().typeError(message).required(message) as Yup.StringSchema;
};

const YupNumberSelect = (message: string): Yup.NumberSchema => {
  return YupNumberTypeRequired(message).min(1, message) as Yup.NumberSchema;
};

const YupNumberValidOption = (message: string): Yup.NumberSchema => {
  return YupNumberTypeRequired(message)
    .integer('정수로 입력해주세요')
    .min(0, '양수로 입력해주세요') as Yup.NumberSchema;
};

const providerValidation = {
  providerInfo: Yup.object().nullable().required('입점사를 선택해주세요'),
  adminMdInfo: Yup.object().nullable().required('MD를 선택해주세요'),
};

const baseValidation = {
  name: Yup.string().required('상품명을 입력해주세요'),
  brandInfo: Yup.object().nullable().required('브랜드를 선택해주세요'),
  category1: YupNumberTypeRequired('카테고리를 선택해주세요'),
  category2: Yup.number().when('category1', (value) => {
    if (!isNaN(value)) {
      return YupNumberTypeRequired('카테고리를 선택해주세요');
    }
    return Yup.mixed().transform(() => 0);
  }),
  category3: Yup.number().when(['category1', 'category2'], (cate1Value, cate2Value) => {
    if (!isNaN(cate1Value) && !isNaN(cate2Value)) {
      return YupNumberTypeRequired('카테고리를 선택해주세요');
    }
    return Yup.mixed().transform(() => 0);
  }),
  startDateTime: YupStringTypeRequired('판매시작일을 설정해주세요'),
  endDateTime: YupStringTypeRequired('판매종료일을 설정해주세요')
    .when('alwaysDateTime', (value) => {
      if (value) {
        return Yup.string().nullable();
      }
    })
    .when('startDateTime', (value, schema) => {
      if (value) {
        return schema.test({
          test: (endDateTime) => {
            if (endDateTime) {
              return new Date(value) <= new Date(endDateTime);
            }
            return true;
          },
          message: '판매종료일은 판매시작일보다 이전일 수 없습니다',
        });
      }
    }),
  displayStartDateTime: YupStringTypeRequired('전시 시작일을 설정해주세요').when('startDateTime', (value, schema) => {
    if (value) {
      return schema.test({
        test: (displayStartDateTime) => {
          if (displayStartDateTime) {
            return new Date(value) >= new Date(displayStartDateTime);
          }
          return true;
        },
        message: '전시시작일은 판매시작일보다 늦을수 없습니다',
      });
    }
  }),
  kcFileList: Yup.array().when('kcAuthYn', (value) => {
    if (value === 'Y') {
      return Yup.array()
        .required('KC 인증 파일을 1개이상 첨부해 주세요')
        .min(1, 'KC 인증 파일을 1개이상 첨부해 주세요');
    }
    return Yup.array().nullable();
  }),
};

const managerBaseValidation = {
  limitedType: Yup.string().when('limitedTypeYn', (value, schema) => {
    if (value === 'Y') {
      return schema.test({
        test: (limitedType) => !(limitedType === PurchaseLimitedType.NONE),
        message: '한정수량 설정에서 타입을 선택해 주세요',
      });
    }
  }),
  ticketId: Yup.string().when('goodsKind', (value) => {
    if (value !== GoodsKind.REAL) {
      return Yup.string().required('티켓을 선택해주세요');
    }
    return Yup.string().nullable();
  }),
  vatCode: Yup.string().when('settlementKind', (value) => {
    if (value === SettlementKindType.BUYING) {
      return YupStringTypeRequired('부가세 코드 등록을 선택해주세요');
    }
    return Yup.string().nullable();
  }),
  searchTags: Yup.string()
    .nullable()
    .test('searchMaxTags', '검색태그는 10개까지 입력 가능합니다', (value) => !value || value.split(',').length <= 10),
};

const baseCreateValidation = {
  ticketGroupId: Yup.string().when('goodsKind', (value) => {
    if (value === GoodsKind.TICKET_AGENT) {
      return Yup.string().required('티켓그룹을 선택해주세요');
    }
    return Yup.string().nullable();
  }),
};

const optionValidation = {
  optionLists: Yup.array()
    .min(1, '옵션리스트를 등록해주세요')
    .of(
      Yup.object().shape({
        consumerPrice: YupNumberValidOption('정상가를 입력해주세요')
          .min(100, '정상가는 100원 이상이여야 합니다')
          .test('unitConsumerPrice', '정상가는 10원 단위로 입력해 주세요', (value) => value % 10 === 0)
          .test('maxConsumerPrice', '정상가는 1억을 넘을 수 없습니다', (value) => value <= 100000000)
          .min(Yup.ref('price'), '판매가는 정상가보다 클 수 없습니다'),
        price: YupNumberValidOption('판매가를 입력해주세요')
          .min(100, '판매가는 100원 이상이여야 합니다')
          .test('unitPrice', '판매가는 10원 단위로 입력해 주세요', (value) => value % 10 === 0)
          .test('maxPrice', '판매가는 1억을 넘을 수 없습니다', (value) => value <= 100000000)
          .max(Yup.ref('consumerPrice'), '판매가는 정상가보다 클 수 없습니다'),
        stock: YupNumberValidOption('재고수량을 입력해주세요'),
        commissionRate: YupNumberTypeRequired('수수료를 입력해주세요')
          .min(0, '양수로 입력해주세요')
          .max(100, '수수료율은 100%를 넘을 수 없습니다')
          .test('commissionRate', '소수점 이하 최대 한자리까지 입력 가능합니다.', (value) =>
            /^\d+((.)|(.\d{0,1})?)$/.test(`${value}`),
          ),
        /** @todo dynamic key validation */
        option1: Yup.string()
          .nullable()
          .test('option1', '옵션값을 입력해주세요', (value, context) => {
            const [, values] = context['from'];
            if (values.value.optionRegister === OptRegisterKinds.STOP) {
              return true;
            }
            return !(isUndefined(value) || value.trim() === '');
          }),
        option2: Yup.string().test('option2', '옵션값을 입력해주세요', (value) => {
          return isUndefined(value) ? true : !(value.trim() === '');
        }),
        option3: Yup.string().test('option3', '옵션값을 입력해주세요', (value) => {
          return isUndefined(value) ? true : !(value.trim() === '');
        }),
        ticketGoodsId: Yup.string()
          .nullable()
          .test('ticketGoodsId', '티켓을 선택해주세요', (value, context) => {
            const [, values] = context['from'];
            if (values.value.goodsKind !== GoodsKind.TICKET_AGENT) {
              return true;
            }
            return !(isUndefined(value) || value.trim() === '');
          }),
        bookingDate: Yup.string()
          .nullable()
          .notRequired()
          .test('bookingDate', '날짜를 설정해주세요', (value, context) => {
            /** @todo Yup.number 타입에 대한 context 값 체크 */
            const [, values] = context['from'];
            if (values.value.ticketTypeId !== TicketType.BOOKING_DATED) {
              return true;
            }
            return !isNaN(+value);
          }),
        depositPrice: Yup.string()
          .nullable()
          .notRequired()
          .test('depositPrice', '입금가를 입력해주세요', (value, context) => {
            /** @todo Yup.number 타입에 대한 context 값 체크 */
            const [, values] = context['from'];
            if (
              ![TicketType.BOOKING_DATED as string, TicketType.BOOKING_UNDATED as string].includes(
                values.value.ticketTypeId ?? '',
              )
            ) {
              return true;
            }
            return !isNaN(+value);
          }),
      }),
    ),
};

const mediaValidation = {
  primaryImageFileId: Yup.number().nullable().required('썸네일 이미지는 필수 항목입니다'),
  description: Yup.string().trim().required('상품설명을 입력해주세요'),
  subMediaFiles: Yup.array()
    .required('대표 컨텐츠를 1개 이상 등록해 주세요')
    .min(1, '대표 컨텐츠를 1개 이상 등록해 주세요'),
};

const noticeValidation = {
  noticeType: Yup.number().when('noticeTemplates', (value: any[]) => {
    /** @issue 221113 상품수정시 value 의 undefined issue, 방어코드 추가 */
    if (!value || value.length === 0) {
      return YupNumberSelect('상품제공고시내 상품군을 선택해주세요');
    }
    return Yup.mixed().nullable();
  }),
  noticeTemplates: Yup.array().of(
    Yup.object().shape({
      contents: Yup.string().required('정보를 입력해주세요'),
    }),
  ),
};

const deliveryValidation = {
  /** @todo validation 이후에 배송 유형 변경시 text */
  deliveryTypeOtherDay: Yup.number().when('deliveryType', {
    is: (value: string) => value === DeliveryType.OTHER,
    then: Yup.number()
      .min(2, '예외발송일은 2일에서 100일 사이로 설정해주세요')
      .max(100, '예외발송일은 2일에서 100일 사이로 설정해주세요')
      .typeError('예외발송일은 2일에서 100일 사이로 설정해주세요')
      .required('예외발송일은 2일에서 100일 사이로 설정해주세요'),
  }),
  deliveryTodayEndTime: Yup.string().test(
    'deliveryTodayEndTime',
    '당일발송 마감시간을 선택해주세요',
    (value, context) => {
      const { value: values } = context['from'][0];
      if (values.goodsKind !== GoodsKind.REAL) {
        return true;
      }
      if (values.deliveryType !== DeliveryType.TODAY) {
        return true;
      }
      return !(isUndefined(value) || value.trim() === '');
    },
  ),
  providerShippingId: YupNumberTypeRequired('배송정책을 선택해주세요'),
  payCost: Yup.number().when('costType', (value) => {
    if (value === DeliveryCostType.UNLIMIT) {
      return YupNumberTypeRequired('유료 배송비를 입력해주세요');
      // return Yup.number().typeError('유료 배송비를 입력해주세요').required('유료 배송비를 입력해주세요');
    }
    return Yup.mixed().transform(() => 0);
  }),
  ifpayCost: Yup.number().when('costType', (value) => {
    if (value === DeliveryCostType.IFPAY) {
      return YupNumberTypeRequired('기본 배송비를 입력해주세요');
    }
    return Yup.mixed().transform(() => 0);
  }),
  ifpayFreePrice: Yup.number().when('costType', (value) => {
    if (value === DeliveryCostType.IFPAY) {
      return YupNumberTypeRequired('배송비 조건을 입력해주세요');
    }
    return Yup.mixed().transform(() => 0);
  }),
  limitShippingPrice: Yup.number().when('costType', (value) => {
    if (value === DeliveryCostType.LIMIT) {
      return YupNumberTypeRequired('기본 배송비를 입력해주세요');
    }
    return Yup.mixed().transform(() => 0);
    // 실제 data 값을 변경 : return Yup.mixed().transform(() => 0);
  }),
  limitShippingEa: Yup.number().when('costType', (value) => {
    if (value === DeliveryCostType.LIMIT) {
      return YupNumberTypeRequired('배송비 조건을 입력해주세요');
    }
    return Yup.mixed().transform(() => 0);
  }),
};

const defaultValidationSchema = {
  ...providerValidation,
  ...baseValidation,
  ...optionValidation,
  ...mediaValidation,
  ...noticeValidation,
  ...deliveryValidation,
};

/** 상품등록 Validation */
export const validationCreateSchema = Yup.object().shape({
  ...defaultValidationSchema,
  ...baseCreateValidation,
  ...managerBaseValidation,
});

/** 파트너 상품등록 Validation */
export const validationPartnerCreateSchema = Yup.object().shape({
  ...baseValidation,
  ...optionValidation,
  ...mediaValidation,
  ...noticeValidation,
  ...deliveryValidation,
});

/** 상품수정 Validation */
export const validationModifySchema = Yup.object().shape({
  ...defaultValidationSchema,
  ...managerBaseValidation,
});

/** 파트너 상품수정 Validation */
export const validationPartnerModifySchema = Yup.object().shape({
  ...baseValidation,
  ...optionValidation,
  ...mediaValidation,
  ...noticeValidation,
  ...deliveryValidation,
});

/****************************************************
 * validation message set
 ****************************************************/
const getValidationErrorList = (values: unknown) => {
  return Object.keys(values).reduce((prev, current) => {
    const currentValues = values[current];
    let message = currentValues?.message ?? '';
    if (current === 'optionLists' && Array.isArray(currentValues)) {
      const errorIndexes = Object.keys(currentValues)
        .map((value) => +value + 1)
        .join(', ');
      message = `옵션 목록내 잘못된 입력이나 누락된 부분이 있습니다\r\n- 오류 인덱스 : ${errorIndexes}`;
    }
    if (current === 'noticeTemplates' && Array.isArray(currentValues)) {
      message = '상품정보제공고시내 누락된 부분이 있습니다';
    }

    return [...prev, message];
  }, []);
};

export const getValidationErrorMessage = (values: unknown) => {
  const errorList = getValidationErrorList(values);
  const errorTemplate = errorList.map((error, index) => {
    return `${index + 1}. ${error}`;
  });
  return !!errorTemplate.length ? errorTemplate.join('\r\n') : '';
};
