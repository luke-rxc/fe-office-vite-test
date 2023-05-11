import { useState } from 'react';
import { AllowItemType } from '../constants';
import { CouponUseAllowPolicyModel } from '../models';
import { PolicyInfo, CouponAllowItem } from '../types';

interface CouponPolicyItemServiceReturn {
  policyInfo: PolicyInfo;
}

export const useCouponPolicyItemService = (policyInfo?: PolicyInfo): CouponPolicyItemServiceReturn => {
  const [allowCategories, setAllowCategories] = useState<Array<CouponAllowItem>>(policyInfo?.allowCategories || []);
  const [allowProviders, setAllowProviders] = useState<Array<CouponAllowItem>>(policyInfo?.allowProviders || []);
  const [allowGoods, setAllowGoods] = useState<Array<CouponAllowItem>>(policyInfo?.allowGoods || []);
  const [allowBrands, setAllowBrands] = useState<Array<CouponAllowItem>>(policyInfo?.allowBrands || []);
  const [denyGoods, setDenyGoods] = useState<Array<CouponAllowItem>>(policyInfo?.denyGoods || []);

  /**
   * 쿠폰허용 아이템 업데이트
   */
  const handleUpdateAllowItem = (type: AllowItemType, items: Array<CouponAllowItem>) => {
    switch (type) {
      case AllowItemType.ALLOW_CATEGORY:
        setAllowCategories(items);
        break;
      case AllowItemType.ALLOW_PROVIDER:
        setAllowProviders(items);
        break;
      case AllowItemType.ALLOW_GOODS:
        setAllowGoods(items);
        break;
      case AllowItemType.ALLOW_BRAND:
        setAllowBrands(items);
        break;
      case AllowItemType.DENY_GOODS:
        setDenyGoods(items);
        break;
      default:
        break;
    }
  };

  /**
   * 쿠폰허용 아이템 제거
   */
  const handleRemoteAllowItem = (type: AllowItemType, id: number) => {
    switch (type) {
      case AllowItemType.ALLOW_CATEGORY:
        setAllowCategories((prev) => prev.filter((item) => item.id !== id));
        break;
      case AllowItemType.ALLOW_PROVIDER:
        setAllowProviders((prev) => prev.filter((item) => item.id !== id));
        break;
      case AllowItemType.ALLOW_GOODS:
        setAllowGoods((prev) => prev.filter((item) => item.id !== id));
        break;
      case AllowItemType.ALLOW_BRAND:
        setAllowBrands((prev) => prev.filter((item) => item.id !== id));
        break;
      case AllowItemType.DENY_GOODS:
        setDenyGoods((prev) => prev.filter((item) => item.id !== id));
        break;
      default:
        break;
    }
  };

  /**
   * 쿠폰허용 아이템 전체 제거
   */
  const handleRemoveAllAllowItem = () => {
    setAllowCategories([]);
    setAllowProviders([]);
    setAllowGoods([]);
    setAllowBrands([]);
    setDenyGoods([]);
  };

  /**
   * 쿠폰허용 아이템 전체 갱신
   */
  const handleUpdateAllAllowItem = (item: Omit<CouponUseAllowPolicyModel, 'isAllowAll'>) => {
    if (item.allowCategories) {
      setAllowCategories(item.allowCategories);
    }
    if (item.allowProviders) {
      setAllowProviders(item.allowProviders);
    }
    if (item.allowGoods) {
      setAllowGoods(item.allowGoods);
    }
    if (item.allowBrands) {
      setAllowBrands(item.allowBrands);
    }
    if (item.denyGoods) {
      setDenyGoods(item.denyGoods);
    }
  };

  return {
    policyInfo: {
      allowCategories,
      allowProviders,
      allowGoods,
      allowBrands,
      denyGoods,
      handleUpdateAllowItem,
      handleRemoteAllowItem,
      handleRemoveAllAllowItem,
      handleUpdateAllAllowItem,
    },
  };
};
