import { useState } from 'react';
import { useQuery } from '@hooks/useQuery';
import { getProviderList } from '../apis';
import { ProviderModel, toProviderModelList } from '../models';
import { ProvideListSchema } from '../schemas';
import { QueryKey } from '../constants';

interface Props {
  enabled: boolean;
  initSelectedProviderInfo?: ProviderModel;
}

export const useProviderService = ({ enabled, initSelectedProviderInfo }: Props) => {
  // 선택된 입점사 정보
  const [selectedProviderInfo, setSelectedProviderInfo] = useState<ProviderModel>(initSelectedProviderInfo ?? null);

  // Api
  const {
    data: providerLists,
    isLoading: isProviderListLoading,
    isError: isProviderListError,
  } = useQuery([QueryKey.ProviderList], getProviderList, {
    enabled,
    select: (data: ProvideListSchema) => toProviderModelList(data?.items),
  });

  const handleSelectProvider = (provider: ProviderModel) => {
    setSelectedProviderInfo(provider);
  };

  return {
    providerLists: providerLists || [],
    isProviderListLoading,
    isProviderListError,
    selectedProviderInfo,
    setSelectedProviderInfo,
    handleSelectProvider,
  };
};
