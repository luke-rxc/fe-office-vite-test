import { useCallback, useMemo, useState } from 'react';
import { CouponPolicyServiceReturn } from '.';
import { CouponInclusion, CouponTabs } from '../components';
import { CouponInclusionTargetTab, AllowItemType, PolicyTab, AllowType } from '../constants';
import {
  CouponCategoryContainer,
  CouponProviderContainer,
  CouponGoodsContainer,
  CouponBrandContainer,
} from '../containers';
import { AllowAllInfo, PolicyInfo, TabItem } from '../types';

interface Props {
  layoutInfo: CouponPolicyServiceReturn;
  policyInfo: PolicyInfo;
  tempPolicyInfo: PolicyInfo;
  allowAllInfo: AllowAllInfo;
}

export const useCouponPolicyModalService = ({
  layoutInfo: { handleModalClose, handleConfirm },
  policyInfo,
  tempPolicyInfo,
  allowAllInfo,
}: Props) => {
  const [isAllowAll, setIsAllowAll] = useState<AllowType>(allowAllInfo.isAllowAll);
  const [selectedTab, setSelectedTab] = useState<PolicyTab>(PolicyTab.INCLUSION);
  const [selectedInclusionTab, setSelectedInclusionTab] = useState<CouponInclusionTargetTab | false>(
    allowAllInfo.isAllowAll === AllowType.ALL ? false : CouponInclusionTargetTab.CATEGORY,
  );

  const handleChangeInclusionTab = useCallback((selectTabValue: CouponInclusionTargetTab | false) => {
    setSelectedInclusionTab(selectTabValue);
  }, []);

  const handleChangeTab = useCallback(
    (selectTabValue: string) => {
      selectedTab !== selectTabValue && setSelectedTab(selectTabValue as PolicyTab);
    },
    [selectedTab],
  );

  const onChangeAllowAll = useCallback(
    (value: AllowType) => {
      setIsAllowAll(value);

      if (value === AllowType.ALL && !!selectedInclusionTab) {
        handleChangeInclusionTab(false);
      } else if (value === AllowType.CASE && !selectedInclusionTab) {
        handleChangeInclusionTab(CouponInclusionTargetTab.CATEGORY);
      }
    },
    [handleChangeInclusionTab, selectedInclusionTab],
  );

  const handleCancelCouponPolicy = () => {
    handleModalClose();
  };

  const handleConfirmCouponPolicy = () => {
    allowAllInfo.handleUpdateAllowAll(isAllowAll);
    policyInfo.handleUpdateAllAllowItem({
      allowCategories: tempPolicyInfo.allowCategories,
      allowProviders: tempPolicyInfo.allowProviders,
      allowGoods: tempPolicyInfo.allowGoods,
      allowBrands: tempPolicyInfo.allowBrands,
      denyGoods: tempPolicyInfo.denyGoods,
    });
    handleConfirm();
  };

  const inclusionTabItems: Array<TabItem> = useMemo(() => {
    return [
      {
        label: `카테고리 (${tempPolicyInfo.allowCategories.length})`,
        value: CouponInclusionTargetTab.CATEGORY,
        children: <CouponCategoryContainer policyInfo={tempPolicyInfo} />,
      },
      {
        label: `입점사 (${tempPolicyInfo.allowProviders.length})`,
        value: CouponInclusionTargetTab.PROVIDER,
        children: <CouponProviderContainer policyInfo={tempPolicyInfo} />,
      },
      {
        label: `상품 (${tempPolicyInfo.allowGoods.length})`,
        value: CouponInclusionTargetTab.GOODS,
        children: <CouponGoodsContainer type={AllowItemType.ALLOW_GOODS} policyInfo={tempPolicyInfo} />,
      },
      {
        label: `브랜드 (${tempPolicyInfo.allowBrands.length})`,
        value: CouponInclusionTargetTab.BRAND,
        children: <CouponBrandContainer type={AllowItemType.ALLOW_BRAND} policyInfo={tempPolicyInfo} />,
      },
    ];
  }, [tempPolicyInfo]);

  const tabItems: Array<TabItem> = useMemo(() => {
    return [
      {
        label: '쿠폰적용',
        value: PolicyTab.INCLUSION,
        children: (
          <CouponInclusion
            isAllowAll={isAllowAll}
            onChangeAllowAll={onChangeAllowAll}
            selectedInclusionTab={selectedInclusionTab}
            inclusionTabItems={inclusionTabItems}
            onChangeTab={handleChangeInclusionTab}
          />
        ),
      },
      {
        label: '쿠폰제외',
        value: PolicyTab.EXCLUSION,
        children: (
          <CouponTabs
            tabName="vertical"
            orientation="vertical"
            selectedTab={CouponInclusionTargetTab.GOODS}
            tabItems={[
              {
                label: '상품',
                value: CouponInclusionTargetTab.GOODS,
                children: <CouponGoodsContainer type={AllowItemType.DENY_GOODS} policyInfo={tempPolicyInfo} />,
              },
            ]}
            onChangeTab={handleChangeTab}
          />
        ),
      },
    ];
  }, [
    handleChangeInclusionTab,
    handleChangeTab,
    inclusionTabItems,
    isAllowAll,
    onChangeAllowAll,
    selectedInclusionTab,
    tempPolicyInfo,
  ]);

  /**
   * 쿠폰 정책 적용 가능여부
   * 조건별 적용시 선택된 항목이 없는 경우 true
   */
  const disabledConfirmCouponPolicy = useMemo(() => {
    const { allowCategories, allowProviders, allowGoods, allowBrands, denyGoods } = tempPolicyInfo;
    const selectedPolicyCount =
      allowCategories.length + allowProviders.length + allowGoods.length + allowBrands.length + denyGoods.length;
    if (isAllowAll === AllowType.CASE && selectedPolicyCount === 0) {
      return true;
    }

    return false;
  }, [isAllowAll, tempPolicyInfo]);

  return {
    tabItems,
    selectedTab,
    disabledConfirmCouponPolicy,
    handleChangeTab,
    handleCancelCouponPolicy,
    handleConfirmCouponPolicy,
  };
};
