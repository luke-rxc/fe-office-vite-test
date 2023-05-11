import { useState, useEffect } from 'react';
import { useQuery } from '@hooks/useQuery';
import { ComboType } from '../constants';
import { getComboList } from '../apis';

export type UseComboBoxServiceResult = ReturnType<typeof useComboBoxService>;

export const useComboBoxService = (comboType: ComboType) => {
  const { isLoading, isSuccess, isFetching, isFetched, refetch, data } = useQuery(
    `combo/${comboType}`,
    () => getComboList(comboType),
    {
      enabled: false,
    },
  );

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    open && refetch();
  }, [open, refetch]);

  const handleOpenCombo = () => setOpen(true);
  const handleCloseCombo = () => setOpen(false);

  return {
    isLoading,
    isSuccess,
    isFetching,
    isFetched,
    open,
    handleOpenCombo,
    handleCloseCombo,
    items: data?.items || [],
  };
};
