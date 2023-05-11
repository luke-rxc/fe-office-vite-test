import toast from 'react-hot-toast';
import { useMutation } from '@hooks/useMutation';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { getShowroomCombo } from '../apis';
import { toComboListModel } from '../models';

/**
 * 쇼룸 콤보리스트 service
 */
export const useShowroomService = () => {
  const { isLoading, mutateAsync } = useMutation((id: number) => getShowroomCombo(id), {
    onError: (error: ErrorModel<ErrorDataModel>) => {
      const msg = error.data.message;
      toast.error(msg);
    },
  });

  const handleGetShowroomList = async (value: number) => {
    const data = await mutateAsync(value);
    return toComboListModel(data.items);
  };
  return {
    isLoading,
    handleGetShowroomList,
  };
};
