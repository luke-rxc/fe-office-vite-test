import { useEffect, useState } from 'react';
import { ProviderModel } from '../../models';

interface Props {
  selectedProviderInfo: ProviderModel;
}

export const useCommissionService = ({ selectedProviderInfo }: Props) => {
  const [selectedCommission, setSelectedCommission] = useState<number>(0);

  const handleUpdateCommission = (commissionRate: number) => {
    if (selectedCommission !== commissionRate) {
      setSelectedCommission(commissionRate);
    }
  };

  useEffect(() => {
    if (selectedProviderInfo) {
      if (selectedCommission !== selectedProviderInfo.commissionRate) {
        setSelectedCommission(selectedProviderInfo.commissionRate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedProviderInfo)]);

  return {
    selectedCommission,
    handleUpdateCommission,
  };
};
