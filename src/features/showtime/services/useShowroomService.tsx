import { useQuery } from '@hooks/useQuery';
import { getShowroomCombo } from '../apis';
import { showroomComboListQueryKey } from '../constants';
import { toShowroomComboListModel } from '../models';

/**
 * showroom service
 */
export const useShowroomService = () => {
  const { data: showroomComboList, isLoading: isLoadingShowroomComboList } = useQuery(
    showroomComboListQueryKey,
    getShowroomCombo,
    {
      select: (data) => {
        return toShowroomComboListModel(data.items);
      },
    },
  );

  return {
    showroomComboList,
    isLoadingShowroomComboList,
  };
};
