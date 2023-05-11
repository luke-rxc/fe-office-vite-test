import { useQuery } from '@hooks/useQuery';
import { getCategoriesRoot, getCategoriesChildren } from '../apis';

export const useCategoryListService = (level: number, parentId?: number) => {
  const isRoot = level === 1;

  // 하위 카테고리 호출 시 parentId가 없으면 disabled
  const enabled = !(!isRoot && !parentId);

  const { data, isLoading, isFetched, isError } = useQuery(
    ['categories', level, parentId],
    () => (isRoot ? getCategoriesRoot() : getCategoriesChildren(parentId)),
    { enabled },
  );

  return { categories: data?.categories, isLoading, isFetched, isError };
};
