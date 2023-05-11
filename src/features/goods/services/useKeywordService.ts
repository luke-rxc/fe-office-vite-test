import { useQuery } from '@hooks/useQuery';
import { getKeywordList } from '../apis';
import { QueryKey } from '../constants';
import { ComboSchema } from '../schemas';
import { toComboModelList } from '../models';

interface Props {
  enabled?: boolean;
}

export const useKeywordService = ({ enabled = true }: Props) => {
  const {
    data: keywordList,
    isLoading: isKeywordListLoading,
    isError: isKeywordListError,
  } = useQuery([QueryKey.KeywordList], getKeywordList, {
    enabled,
    select: (data: ComboSchema) => toComboModelList(data?.items),
  });

  return {
    keywordList: keywordList ?? [],
    isKeywordListLoading,
    isKeywordListError,
  };
};
