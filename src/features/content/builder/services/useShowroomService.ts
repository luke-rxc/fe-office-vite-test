import { useQuery } from '@hooks/useQuery';
import { getShowroomCombo } from '../apis';
import { QUERY_KEY } from '../constants';
import { toComboListModel } from '../models';

/**
 * 쇼룸 콤보리스트 service
 */
export const useShowroomService = () => {
  const { data: showroomComboList, isLoading: isLoadingShowroomComboList } = useQuery(
    [QUERY_KEY.SHOWROOM_COMBO],
    getShowroomCombo,
    {
      select: (data) => {
        return toComboListModel(data.items);
      },
    },
  );

  return {
    showroomComboList,
    isLoadingShowroomComboList,
  };
};
