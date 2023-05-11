import { useQuery } from '@hooks/useQuery';
import { getManagerList } from '../apis';
import { QueryKey } from '../constants';
import { ComboSchema } from '../schemas';
import { toComboModelList } from '../models';

interface Props {
  enabled: boolean;
}

export const useManagerService = ({ enabled }: Props) => {
  const {
    data: managerList,
    isLoading: isManagerListLoading,
    isError: isManagerListError,
  } = useQuery([QueryKey.ManagerList], getManagerList, {
    select: (data: ComboSchema) => toComboModelList(data?.items),
    enabled,
  });

  return {
    managerList: managerList ?? [],
    isManagerListLoading,
    isManagerListError,
  };
};
