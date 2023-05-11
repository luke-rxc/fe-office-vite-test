import { UploadFileInfo } from '@models/UploadModel';
import { getIsVideoType } from '@utils/files';
import { toDateFormat } from '@utils/date';
import { UploadFileType } from '@services/useFileUploader';
import {
  GoodsKind,
  GoodsShippingPolicy,
  GoodsShippingMethod,
  LimitType as DeliveryCostType,
  PurchaseLimitedType,
} from '@constants/goods';
import { DeliveryType, FileType, OptRegisterKinds } from '../constants';
import {
  GoodsInfoResSchema,
  SubmitReqSchema,
  MediaFileSchema,
  FeedConfigSchema,
  GoodsRequestLogSchema,
  GoodsRequestLogInfoSchema,
  PartnerSubmitReqSchema,
  PartnerModifySubmitReqSchema,
} from '../schemas';
import { toDataFormatExtend, isY, boolToYn, getCommaStringToList } from '../utils';
import { OptListModel, toOptionList, toOptSubmitReqParam } from './DetailOptionModel';
import { StateModel, MediaFilesModel } from './DetailStateModel';
import { toComboModelList } from './ComboModel';

/**
 * 상품 조회 Response Model
 */
export interface GoodsInfoResModel extends Omit<GoodsInfoResSchema, 'components' | 'providerShippingId'> {
  optionLists: OptListModel[];
  subMediaFiles?: UploadFileInfo[];
  components: UploadFileInfo[];
  providerShippingId: number | string;
}

/**
 * 상품 상세 조회
 */
export const toGoodsInfo = (value: GoodsInfoResSchema, isTempMapping = false): GoodsInfoResModel => {
  const { optionTitles, options, files, components, ticket } = value;
  return {
    ...value,
    optionLists: toOptionList({
      opts: options,
      optTitles: optionTitles,
      isTempMapping,
      ticket,
    }),
    subMediaFiles: toMediaFiles(files),
    components: toMediaFiles(components),
  };
};

const toMediaFiles = (filesInfo: MediaFileSchema[]): UploadFileInfo[] => {
  // 임시 저장 케이스
  if (!filesInfo) {
    return null;
  }
  return filesInfo.map((fileInfo) => {
    const { file, videoPlayType } = fileInfo;
    return {
      ...file,
      fileType: getIsVideoType(file.extension) ? FileType.VIDEO : FileType.IMAGE,
      videoPlayType,
    };
  });
};

export const toMediaFormData = (
  filesInfo: UploadFileInfo[],
): {
  info: MediaFilesModel[];
  ids: number[];
} => {
  const info = filesInfo.map((fileInfo) => {
    const { id, mp4, videoPlayType, fileType } = fileInfo;
    return {
      id: fileType === UploadFileType.VIDEO ? (mp4 && mp4.id) ?? id : id,
      type: fileType,
      videoPlayType,
    };
  }) as MediaFilesModel[];
  const ids = filesInfo.map((fileInfo) => {
    return fileInfo?.id;
  });
  return {
    info,
    ids,
  };
};

const toFeedConfigList = (feedConfig: FeedConfigSchema | null): boolean[] => {
  if (!feedConfig) {
    return null;
  }
  const { facebook, google, naver } = feedConfig;
  return [facebook, google, naver];
};

export const toGoodsFormData = (value: GoodsInfoResModel): Partial<StateModel> => {
  const {
    name,
    providerId,
    providerName,
    commissionRate,
    description,
    brandId,
    brandName,
    adminMdId,
    adminGoodsManagerId,
    status,
    displayPeriod,
    purchase,
    isAdultRequired,
    isPrizmOnly,
    isUseCoupon,
    isPcccRequired,
    informationList,
    shipping,
    deliveryPolicy,
    providerShippingId,
    isOptionUse,
    goodsType,
    keyword,
    kcFileList,
    goodsKind,
    ticket,
    primaryImage,
    searchTags,
    code,
    isDataCollect,
    partnerExportCode,
    settlementKind,
    vatCode,
    feedConfig,
    isCancelable,
  } = value;
  const { salesStartDate, salesEndDate, displayStartDate } = displayPeriod;
  const { userMaxPurchaseLimit, userMaxPurchaseEa, limitedType, limitedGoodsEa } = purchase;
  const { deliveryExportingDelays } = deliveryPolicy;
  const {
    shippingPolicy,
    shippingMethod,
    goodsShippingPolicy,
    unLimitShippingPrice,
    limitShippingEa,
    limitShippingPrice,
    ifpayCost,
    ifpayFreePrice,
  } = shipping;
  const { id: primaryImageFileId } = primaryImage ?? {};

  return {
    name,
    providerId,
    providerInfo: {
      value: providerId,
      label: providerName,
      commissionRate,
    },
    brandId,
    brandInfo: {
      value: brandId,
      label: brandName,
    },
    adminMdId,
    adminGoodsManagerId,
    status,
    description,
    startDateTime: timeStampToString(salesStartDate),
    endDateTime: timeStampToString(salesEndDate),
    displayStartDateTime: timeStampToString(displayStartDate),
    alwaysDateTime: salesStartDate && !salesEndDate,
    sameSalesTime: !!(salesStartDate && displayStartDate && salesStartDate === displayStartDate),
    userMaxPurchaseLimit,
    userMaxPurchaseEa: userMaxPurchaseEa ?? 0,
    limitedTypeYn: boolToYn(limitedType === PurchaseLimitedType.GOODS || limitedType === PurchaseLimitedType.OPTION),
    limitedType,
    limitedGoodsEa: limitedGoodsEa ?? 0,
    adultRequiredYn: boolToYn(isAdultRequired),
    prizmOnlyYn: boolToYn(isPrizmOnly),
    useCouponYn: boolToYn(isUseCoupon),
    isPcccRequired: boolToYn(isPcccRequired),
    noticeTemplates: informationList,
    shippingPolicy,
    shippingMethod,
    unLimitShippingPrice,
    goodsShippingPolicy,
    providerShippingId,
    limitShippingEa,
    limitShippingPrice,
    ifpayCost,
    ifpayFreePrice,
    deliveryType: getDeliveryType(deliveryExportingDelays),
    deliveryTypeOtherDay: deliveryExportingDelays > 1 ? deliveryExportingDelays : 0,
    optionRegister: isOptionUse ? OptRegisterKinds.PROGRESS : OptRegisterKinds.STOP,
    goodsType,
    keywords: toComboModelList(keyword),
    kcAuthYn: boolToYn(!!(kcFileList && kcFileList.length)),
    goodsKind,
    ticketId: ticket?.id ?? null,
    ticketGroupId: ticket?.groupId ?? null,
    primaryImageFileId: primaryImageFileId ?? null,
    searchTags: searchTags.map((searchTags) => searchTags.value).join(','),
    ticketTypeId: ticket?.type?.id ?? null,
    code: code ?? '',
    dataCollectYn: boolToYn(isDataCollect),
    partnerExportCode: partnerExportCode ?? '',
    settlementKind,
    vatCode,
    feedConfigList: toFeedConfigList(feedConfig),
    cancelableYn: boolToYn(isCancelable),
  };
};

export const toModifySubmitReqParam = (value: Partial<StateModel>): SubmitReqSchema => {
  return {
    ...toSubmitReqParam(value),
    status: value.status,
  };
};

const toFeedConfig = (feedConfigList: boolean[] | null): FeedConfigSchema | null => {
  if (!feedConfigList) {
    return null;
  }

  const [facebook, google, naver] = feedConfigList;
  return {
    facebook,
    google,
    naver,
  };
};

export const toSubmitReqParam = (value: Partial<StateModel>): SubmitReqSchema => {
  const {
    adminMdId,
    adminGoodsManagerId,
    brandId,
    category3,
    addCategory3,
    description,
    adultRequiredYn,
    prizmOnlyYn,
    useCouponYn,
    isPcccRequired,
    name,
    subMediaFiles,
    components,
    noticeTemplates,
    primaryImageFileId,
    providerId,
    deliveryType,
    deliveryTypeOtherDay,
    deliveryTodayEndTime,
    userMaxPurchaseLimit,
    userMaxPurchaseEa,
    limitedTypeYn,
    limitedType,
    limitedGoodsEa,
    startDateTime,
    endDateTime,
    displayStartDateTime,
    providerShippingId,
    goodsShippingPolicy,
    shippingPolicy,
    shippingMethod,
    unLimitShippingPrice,
    ifpayCost,
    ifpayFreePrice,
    limitShippingPrice,
    limitShippingEa,
    goodsType,
    keywords,
    kcAuthYn,
    kcFileList,
    certificationList,
    goodsKind,
    ticketId,
    searchTags,
    code,
    dataCollectYn,
    partnerExportCode,
    settlementKind,
    vatCode,
    feedConfigList,
    cancelableYn,
  } = value;

  return {
    adminMdId,
    adminGoodsManagerId,
    brandId,
    categoryIds: +addCategory3 ? [+category3, +addCategory3] : [+category3],
    deliveryPolicy:
      goodsKind === GoodsKind.REAL
        ? {
            deliveryTodayEndTime,
            deliveryExportingDelays: getDeliveryExportingDelays(deliveryType, deliveryTypeOtherDay),
          }
        : getTicketDeliveryPolicy(),
    description,
    files: subMediaFiles,
    components: components && components.length ? components : null,
    informationList: noticeTemplates.map(({ contents, title }, index) => ({
      contents,
      title,
      sortNumber: index + 1,
    })),
    isAdultRequired: isY(adultRequiredYn),
    isPrizmOnly: isY(prizmOnlyYn),
    isUseCoupon: isY(useCouponYn),
    isPcccRequired: isY(isPcccRequired),
    name,
    primaryCategoryId: +category3,
    primaryImageFileId,
    providerId,
    providerShippingId: +providerShippingId,
    purchaseInfo: {
      userMaxPurchaseLimit,
      userMaxPurchaseEa: +userMaxPurchaseEa,
      limitedType: isY(limitedTypeYn) ? limitedType : PurchaseLimitedType.NONE,
      limitedGoodsEa: limitedType === PurchaseLimitedType.GOODS ? +limitedGoodsEa : null,
    },
    salesPeriod: {
      startDateTime: stringToTimeStamp(startDateTime),
      displayStartDateTime: stringToTimeStamp(displayStartDateTime),
      endDateTime: stringToTimeStamp(endDateTime),
    },
    shippingInfo:
      goodsKind === GoodsKind.REAL
        ? {
            shippingPolicy,
            shippingMethod,
            goodsShippingPolicy,
            /** @issue 원래 타입은 number 이나 react-hook-form 의 input 에서 string 변환값이 나와, 여기서 다시 number로 casting */
            unLimitShippingPrice: +unLimitShippingPrice,
            ifpayCost: +ifpayCost,
            ifpayFreePrice: +ifpayFreePrice,
            limitShippingPrice: +limitShippingPrice,
            limitShippingEa: +limitShippingEa,
          }
        : getTicketShippingInfo(),
    goodsType,
    keywordIds: keywords && keywords.length ? keywords.map(({ value }) => value) : null,
    kcIds: isY(kcAuthYn) ? kcFileList.map(({ id }) => id) : null,
    certificationIds: !!certificationList.length ? certificationList.map(({ id }) => id) : null,
    goodsKind,
    ticketId: goodsKind !== GoodsKind.REAL && ticketId ? +ticketId : null,
    searchTags: searchTags && !!searchTags.trim() ? getCommaStringToList(searchTags as string) : null,
    code,
    isDataCollect: isY(dataCollectYn),
    partnerExportCode: partnerExportCode && !!partnerExportCode.trim() ? partnerExportCode.trim() : null,
    settlementKind,
    vatCode,
    feedConfig: toFeedConfig(feedConfigList),
    isCancelable: isY(cancelableYn),
  };
};

/**
 * Util (converter)
 */
const getTicketShippingInfo = () => ({
  shippingPolicy: GoodsShippingPolicy.GOODS,
  shippingMethod: GoodsShippingMethod.MOBILE,
  goodsShippingPolicy: DeliveryCostType.UNLIMIT,
  unLimitShippingPrice: 0,
  ifpayCost: 0,
  ifpayFreePrice: 0,
  limitShippingPrice: 0,
  limitShippingEa: 0,
});

const getTicketDeliveryPolicy = () => ({
  deliveryTodayEndTime: '07:00',
  deliveryExportingDelays: 0,
});

const getDeliveryType = (deliveryExportingDelays: number): DeliveryType => {
  if (deliveryExportingDelays === 0) {
    return DeliveryType.TODAY;
  }

  return deliveryExportingDelays === 1 ? DeliveryType.TOMORROW : DeliveryType.OTHER;
};

const getDeliveryExportingDelays = (deliveryType: DeliveryType, deliveryTypeOtherDay: number): number => {
  if (deliveryType === DeliveryType.TODAY) {
    return 0;
  }

  return deliveryType === DeliveryType.TOMORROW ? 1 : deliveryTypeOtherDay;
};

const timeStampToString = (timeStamp?: number): string => {
  return timeStamp ? toDataFormatExtend(timeStamp) : '';
};

const stringToTimeStamp = (dateStr?: string): string | null => {
  return dateStr !== '' ? `${new Date(dateStr).getTime()}` : null;
};

/**
 * 요청(판매,수정)에 대한 로그 Schema
 */
export interface GoodsRequestLogModel {
  id: number;
  dateText: string;
  message: string;
  processHandler: string;
}

const toGoodsRequestLog = (item: GoodsRequestLogInfoSchema): GoodsRequestLogModel => {
  const { id, createdDateTime, message, name, email } = item;
  return {
    id,
    dateText: toDateFormat(createdDateTime),
    message,
    processHandler: email ?? name,
  };
};

export const toGoodsRequestLogList = (item: GoodsRequestLogSchema | null): GoodsRequestLogModel[] => {
  if (!item || !item.logs) {
    return [];
  }
  return item.logs.map(toGoodsRequestLog);
};

/**
 * 파트너 등록 Request Param
 */
export const toPartnerSubmitReqParam = (value: Partial<StateModel>, providerId: number): PartnerSubmitReqSchema => {
  return {
    goods: {
      ...toSubmitReqParam(value),
      providerId,
    },
    goodsOption: toOptSubmitReqParam(value),
  };
};

/**
 * 파트너 수정 Request Param
 */
export const toPartnerModifySubmitDataReqParam = (value: Partial<StateModel>): PartnerSubmitReqSchema => {
  return {
    goods: toModifySubmitReqParam(value),
    goodsOption: toOptSubmitReqParam(value),
  };
};

export const toPartnerModifySubmitReqParam = (
  value: Partial<StateModel>,
  requestMemo: string,
): PartnerModifySubmitReqSchema => {
  return {
    ...toPartnerModifySubmitDataReqParam(value),
    requestMemo,
  };
};
