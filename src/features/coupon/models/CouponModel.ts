import { toDateFormat } from '@utils/date';
import { ShowroomComboItemModel } from '.';
import {
  AllowType,
  CouponCostType,
  CouponIssuePeriodType,
  CouponIssueType,
  CouponUseType,
  CouponUseTypeLabel,
  defaultSearchPage,
  defaultSearchSize,
  defaultSearchSort,
  DownloadLimitType,
  MinPurchasePriceLimit,
} from '../constants';

import {
  CouponSchema,
  CouponDisplaySchema,
  CouponIssuePeriodSchema,
  CouponSalePolicySchema,
  CouponDownloadPolicySchema,
  CouponIssueStatSchema,
  CouponItemSchema,
  CouponUseAllowPolicySchema,
  CouponUseAllowPolicyCategoryItemSchema,
  CouponUseAllowPolicyItemSchema,
  CouponEventUploadSchema,
} from '../schemas';
import {
  CouponAllowItem,
  CouponFormField,
  CouponListFormValue,
  CouponListQueryState,
  CouponListSearchParams,
  CouponRequestParams,
  PolicyInfo,
} from '../types';
import { getDateTime } from '../utils';

/**
 * 쿠폰 디폴트 values
 */
export const couponDefaultValues = {
  name: '',
  providerChargeRate: '',
  display: {
    name: '',
    contents: '',
    imageId: null,
  },
  usePolicyRequest: {
    isAllowAll: AllowType.ALL,
  },
  downloadPolicy: {
    issueType: CouponIssueType.DOWNLOAD,
    keyword: '',
    useLimitEa: DownloadLimitType.UNLIMIT,
    limitEaAll: '',
    startDateTime: null,
    endDateTime: null,
    showRoomId: null,
  },
  issuePeriod: {
    issuePeriodType: CouponIssuePeriodType.DAY,
    downloadAfterDay: '',
    startDateTime: null,
    expiredDateTime: null,
  },
  salePolicy: {
    useLimitMinPurchasePrice: MinPurchasePriceLimit.UNLIMIT,
    limitMinPurchasePrice: '',
    value: '',
    limitMaxSalePrice: '',
    costType: '',
  },
  useType: '',
};

export interface CouponIssueStatModel extends CouponIssueStatSchema {
  statText: string;
}

export interface CouponDownloadPolicyModel extends CouponDownloadPolicySchema {
  downloadPolicyText: string;
}

export interface CouponSalePolicyModel extends CouponSalePolicySchema {
  saleInfoText: string;
}

export interface CouponIssuePeriodModel extends CouponIssuePeriodSchema {
  useEnabledPeriodText: string;
}

export type CouponDisplayModel = CouponDisplaySchema;
export type CouponEventUploadModel = CouponEventUploadSchema;

export interface CouponModel extends CouponSchema {
  useTypeText: string;
  createdDateText: string;
  display: CouponDisplayModel;
  issuePeriod: CouponIssuePeriodModel;
  salePolicy: CouponSalePolicyModel;
  downloadPolicy: CouponDownloadPolicyModel;
  issuedStat: CouponIssueStatModel | null;
  activeText: string;
}

/**
 * 할인혜택 text 리턴
 */
const getSaleInfoText = (item: CouponSalePolicySchema) => {
  switch (item.costType) {
    case CouponCostType.PERCENT:
      return `${item.percentRate}% 할인${
        item.limitMaxSalePrice > 0 ? ` (최대 ${item.limitMaxSalePrice.toLocaleString()}원)` : ''
      }`;
    case CouponCostType.WON:
      return `${item.fixedPrice.toLocaleString()}원 고정할인`;
    default:
      break;
  }
};

/**
 * 사용기간 text 리턴
 */
const getUseEnabledPeriodText = (item: CouponIssuePeriodSchema) => {
  const startDate = toDateFormat(item.startDateTime);
  const endDate = toDateFormat(item.expiredDateTime);

  switch (item.issuePeriodType) {
    case CouponIssuePeriodType.PERIOD:
      return `${startDate} ~ ${endDate}`;
    case CouponIssuePeriodType.DAY:
      return `발급일로부터 ${item.downloadAfterDay}일`;

    default:
      break;
  }
};

export const toCouponDownloadPolicyModel = (item: CouponDownloadPolicySchema): CouponDownloadPolicyModel => {
  return {
    ...item,
    downloadPolicyText: `${toDateFormat(item.startDateTime)} ~ ${toDateFormat(item.endDateTime)}`,
  };
};

export const toCouponIssueStatModel = (item: CouponIssueStatSchema): CouponIssueStatModel => {
  return {
    ...item,
    statText: `${item.totalUseCount} 사용 / ${item.totalIssueCount} 발급`,
  };
};

export const toCouponSalePolicyModel = (item: CouponSalePolicySchema): CouponSalePolicyModel => {
  return {
    ...item,
    saleInfoText: getSaleInfoText(item),
  };
};

export const toCouponIssuePeriodModel = (item: CouponIssuePeriodSchema): CouponIssuePeriodModel => {
  return {
    ...item,
    useEnabledPeriodText: getUseEnabledPeriodText(item),
  };
};

export const toCouponModel = (item: CouponSchema): CouponModel => {
  return {
    ...item,
    useTypeText: CouponUseTypeLabel[item.useType],
    issuePeriod: toCouponIssuePeriodModel(item.issuePeriod),
    salePolicy: toCouponSalePolicyModel(item.salePolicy),
    downloadPolicy: toCouponDownloadPolicyModel(item.downloadPolicy),
    issuedStat: item.issuedStat ? toCouponIssueStatModel(item.issuedStat) : null,
    activeText: typeof item.isActive === 'boolean' ? (item.isActive ? '활성화' : '비활성화') : null,
    createdDateText: item.createdDate ? toDateFormat(item.createdDate) : null,
  };
};

export const toCouponModelList = (items: Array<CouponSchema>): Array<CouponModel> => {
  return items.map(toCouponModel);
};

/**
 * 쿠폰 폼 data => 쿠폰 request param convert
 */
export const toCouponRequestParamsByForm = (item: CouponFormField, policyInfo: PolicyInfo): CouponRequestParams => {
  const { name, providerChargeRate, display, downloadPolicy, issuePeriod, salePolicy, usePolicyRequest, useType } =
    item;
  const isAllowAllCouponPolicy = usePolicyRequest.isAllowAll === AllowType.ALL;

  return {
    name,
    providerChargeRate: Number(providerChargeRate),
    display: {
      ...display,
      contents: display.contents,
      imageId: display.imageId ? Number(display.imageId) : null,
    },
    downloadPolicy: {
      endDateTime: getDateTime(downloadPolicy.endDateTime),
      issueType: downloadPolicy.issueType as CouponIssueType,
      keyword: downloadPolicy.issueType === CouponIssueType.KEYWORD ? downloadPolicy.keyword || null : null,
      limitEaAll: downloadPolicy.useLimitEa === DownloadLimitType.LIMIT ? Number(downloadPolicy.limitEaAll) : 0,
      limitEaPerUser: 1,
      startDateTime: getDateTime(downloadPolicy.startDateTime),
      showRoomId:
        downloadPolicy.issueType === CouponIssueType.SHOWROOM ? Number(downloadPolicy.showRoomId.value) : null,
    },
    issuePeriod: {
      issuePeriodType: issuePeriod.issuePeriodType as CouponIssuePeriodType,
      downloadAfterDay:
        issuePeriod.issuePeriodType === CouponIssuePeriodType.DAY && issuePeriod.downloadAfterDay
          ? Number(issuePeriod.downloadAfterDay)
          : null,
      startDateTime:
        issuePeriod.issuePeriodType === CouponIssuePeriodType.PERIOD ? getDateTime(issuePeriod.startDateTime) : null,
      expiredDateTime:
        issuePeriod.issuePeriodType === CouponIssuePeriodType.PERIOD ? getDateTime(issuePeriod.expiredDateTime) : null,
    },
    salePolicy: {
      costType: salePolicy.costType as CouponCostType,
      fixedPrice: salePolicy.costType === CouponCostType.WON ? Number(salePolicy.value) : 0,
      limitMaxSalePrice: salePolicy.limitMaxSalePrice ? Number(salePolicy.limitMaxSalePrice) : null,
      limitMinPurchasePrice:
        salePolicy.useLimitMinPurchasePrice === MinPurchasePriceLimit.LIMIT
          ? Number(salePolicy.limitMinPurchasePrice)
          : 0,
      percentRate: salePolicy.costType === CouponCostType.PERCENT ? Number(salePolicy.value) : null,
    },
    usePolicyRequest: {
      allowBrandIds: isAllowAllCouponPolicy ? [] : policyInfo.allowBrands.map((item) => item.id),
      allowCategoryIds: isAllowAllCouponPolicy ? [] : policyInfo.allowCategories.map((item) => item.id),
      allowGoodsIds: isAllowAllCouponPolicy ? [] : policyInfo.allowGoods.map((item) => item.id),
      allowProviderIds: isAllowAllCouponPolicy ? [] : policyInfo.allowProviders.map((item) => item.id),
      denyGoodsIds: isAllowAllCouponPolicy ? [] : policyInfo.denyGoods.map((item) => item.id),
      isAllowAll: isAllowAllCouponPolicy,
    },
    useType: useType as CouponUseType,
  };
};

/**
 * Coupon 허용정책 model
 */
export interface CouponUseAllowPolicyModel {
  allowBrands: Array<CouponAllowItem>;
  allowCategories: Array<CouponAllowItem>;
  allowGoods: Array<CouponAllowItem>;
  allowProviders: Array<CouponAllowItem>;
  denyGoods: Array<CouponAllowItem>;
  isAllowAll: boolean;
}

/**
 * CouponItemSchema > CouponFormField convert
 */
export const toCouponFormField = (
  {
    name,
    providerChargeRate,
    display,
    downloadPolicy,
    issuePeriod,
    salePolicy,
    useAllowPolicy,
    useType,
  }: CouponItemSchema,
  showroomComboList: Array<ShowroomComboItemModel>,
): CouponFormField => {
  return {
    ...couponDefaultValues,
    name,
    providerChargeRate: providerChargeRate !== null ? providerChargeRate.toString() : '',
    display: {
      ...display,
      imageId: display.image ? display.image.id.toString() : null,
    },
    downloadPolicy: {
      issueType: downloadPolicy.issueType,
      keyword: downloadPolicy.keyword ?? '',
      useLimitEa: downloadPolicy.limitEaAll === 0 ? DownloadLimitType.UNLIMIT : DownloadLimitType.LIMIT,
      limitEaAll: downloadPolicy.limitEaAll ? downloadPolicy.limitEaAll.toString() : '',
      startDateTime: new Date(downloadPolicy.startDateTime),
      endDateTime: new Date(downloadPolicy.endDateTime),
      showRoomId: (showroomComboList ?? []).find(({ value }) => value === downloadPolicy.showRoomId),
    },
    issuePeriod: {
      ...issuePeriod,
      downloadAfterDay: issuePeriod.downloadAfterDay ? issuePeriod.downloadAfterDay.toString() : '',
      startDateTime: issuePeriod.startDateTime ? new Date(issuePeriod.startDateTime) : null,
      expiredDateTime: issuePeriod.expiredDateTime ? new Date(issuePeriod.expiredDateTime) : null,
    },
    salePolicy: {
      limitMinPurchasePrice: salePolicy.limitMinPurchasePrice === 0 ? '' : salePolicy.limitMinPurchasePrice.toString(),
      useLimitMinPurchasePrice: salePolicy.limitMinPurchasePrice
        ? MinPurchasePriceLimit.LIMIT
        : MinPurchasePriceLimit.UNLIMIT,
      value: (salePolicy.costType === CouponCostType.WON ? salePolicy.fixedPrice : salePolicy.percentRate).toString(),
      limitMaxSalePrice: salePolicy.limitMaxSalePrice ? salePolicy.limitMaxSalePrice.toString() : '',
      costType: salePolicy.costType,
    },
    usePolicyRequest: {
      isAllowAll: useAllowPolicy.isAllowAll ? AllowType.ALL : AllowType.CASE,
    },
    useType,
  };
};

/**
 * CouponUseAllowPolicyItemSchema or CouponUseAllowPolicyCategoryItemSchema > CouponAllowItem convert
 */
export const toCouponAllowItem = (
  item: CouponUseAllowPolicyItemSchema | CouponUseAllowPolicyCategoryItemSchema,
): CouponAllowItem => {
  if (Array.isArray(item.name)) {
    return {
      id: item.id,
      text: item.name.join(' > '),
    };
  }

  return {
    id: item.id,
    text: item.name,
  };
};

/**
 * CouponUseAllowPolicySchema > CouponUseAllowPolicyModel convert
 */
export const toCouponUseAllowPolicyModel = (item: CouponUseAllowPolicySchema): CouponUseAllowPolicyModel => {
  return {
    allowBrands: item.allowBrands.map(toCouponAllowItem),
    allowCategories: item.allowCategories.map(toCouponAllowItem),
    allowGoods: item.allowGoods.map(toCouponAllowItem),
    allowProviders: item.allowProviders.map(toCouponAllowItem),
    denyGoods: item.denyGoods.map(toCouponAllowItem),
    isAllowAll: item.isAllowAll,
  };
};

/**
 * CouponEventUploadSchema > CouponEventUploadModel convert
 */
export const toCouponEventUploadModel = (item: CouponEventUploadSchema): CouponEventUploadModel => {
  return item as CouponEventUploadModel;
};

/**
 * coupon list form field > query state convert
 */
export const toCouponListFormFieldByQueryState = (
  item: CouponListQueryState,
  defaultFormValues: CouponListFormValue,
): CouponListFormValue => {
  return {
    name: item.name || defaultFormValues.name,
  };
};

/**
 * coupon list form field > search params convert
 */
export const toCouponListSearchParamsByQueryState = (
  item: CouponListQueryState,
  defaultFormValues: CouponListFormValue,
): CouponListSearchParams => {
  const formField = toCouponListFormFieldByQueryState(item, defaultFormValues);

  return {
    size: item.size || defaultSearchSize,
    page: item.page || defaultSearchPage,
    sort: defaultSearchSort,
    name: formField.name,
  };
};
