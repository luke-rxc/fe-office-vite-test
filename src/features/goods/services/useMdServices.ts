import { useQuery } from '@hooks/useQuery';
import { getMdList } from '../apis';
import { QueryKey } from '../constants';
import { ComboSchema } from '../schemas';
import { toComboModelList } from '../models';

interface Props {
  enabled: boolean;
}

export const useMdServices = ({ enabled }: Props) => {
  const {
    data: mdList,
    isLoading: isMdListLoading,
    isError: isMdListError,
  } = useQuery([QueryKey.MDAllList], getMdList, {
    select: (data: ComboSchema) => toComboModelList(data?.items),
    enabled,
  });

  return {
    mdList: mdList ?? [],
    isMdListLoading,
    isMdListError,
  };
};
