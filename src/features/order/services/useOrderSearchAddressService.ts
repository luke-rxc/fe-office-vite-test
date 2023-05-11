import { useAddress } from '@hooks/useAddress';
import { useState } from 'react';

interface Props {
  onUpdateAddress: (postCode: string, address: string) => void;
}

export type ReturnTypeUseOrderSearchAddressService = ReturnType<typeof useOrderSearchAddressService>;

export const useOrderSearchAddressService = ({ onUpdateAddress }: Props) => {
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  const { ref, show } = useAddress<HTMLDivElement>({
    callbackComplete: ({ code, addr }) => {
      onUpdateAddress(code, addr);
      setShowAddressModal(false);
    },
  });

  /**
   * address modal show
   */
  const handleClickShowAddressModal = () => {
    setShowAddressModal(true);
  };

  /**
   * address modal hide
   */
  const handleClickHideAddressModal = () => {
    setShowAddressModal(false);
  };

  return {
    showAddressModal,
    handleClickShowAddressModal,
    handleClickHideAddressModal,
    addressRef: ref,
    loadAddress: show,
  };
};
