import { PROVIDER_ACCESS_LIST, TOKEN } from '@constants/auth';
import { SiteType } from '@constants/site';
import { useDialog } from '@hooks/useDialog';
import { useSiteType } from '@hooks/useSiteType';
import { DialogType } from '@models/DialogModel';
import { ProviderMenuModel, toProviderMenuListModel } from '@models/userModel';
import { AuthToken } from '@schemas/user';
import { getProvider } from '@utils/auth';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

/**
 * 파트너의 입점사 메뉴관리 service
 */
export const usePartnerProviderMenuService = () => {
  const dialog = useDialog();
  const navigate = useNavigate();
  const currentSiteType = useSiteType();
  const currentAuthToken = getProvider();
  const [currentPartnerProvider, setCurrentPartnerProvider] = useState<ProviderMenuModel>(
    currentAuthToken ? { ...currentAuthToken, readOnly: true } : null,
  );

  /**
   * 파트너 입점사 menu
   */
  const partnerProviderMenus = useMemo(() => {
    if (currentSiteType === SiteType.MANAGER) {
      return [];
    }

    try {
      const providerAccessList = JSON.parse(localStorage.getItem(PROVIDER_ACCESS_LIST)) as Array<AuthToken>;
      return toProviderMenuListModel(providerAccessList, currentPartnerProvider);
    } catch (error) {
      return [];
    }
  }, [currentSiteType, currentPartnerProvider]);

  /**
   * 파트너 입점사 변경 event
   */
  const handleChangePartnerProvider = (option: ProviderMenuModel) => {
    localStorage.setItem(TOKEN, option.token);
    setCurrentPartnerProvider(option);

    dialog.open({
      type: DialogType.ALERT,
      content: `관리 입점사를 ${option.providerName} 입점사로 변경합니다.`,
      onClose: () => {
        navigate(0);
      },
    });
  };

  return {
    isPartner: currentSiteType === SiteType.PARTNER,
    currentPartnerProvider,
    partnerProviderMenus,
    handleChangePartnerProvider,
  };
};
