import { useQueryClient } from 'react-query';
import { useMutation } from '@hooks/useMutation';
import { updateCategorySort } from '../apis';
import type { CategoriesSchema } from '../schemas';

interface CategorySortParams {
  categoryId: number;
  level: number;
  parentId: number;

  // 1부터 시작되는 이동할 위치
  position: number;
}

type QueryKey = Pick<CategorySortParams, 'level' | 'parentId'>;

export const useCategorySortService = () => {
  const queryClient = useQueryClient();

  const getQueryKey = ({ level, parentId }: QueryKey) => {
    return ['categories', level, level > 1 ? parentId : null];
  };

  const getCacheCategories = ({ level, parentId }) => {
    return queryClient.getQueryData<CategoriesSchema>(getQueryKey({ level, parentId }));
  };

  const getReorderCategories = ({ categoryId, level, parentId, position }: CategorySortParams) => {
    const { categories } = queryClient.getQueryData<CategoriesSchema>(getQueryKey({ level, parentId }));

    const targetIndex = position - 1;
    const currentIndex = categories.findIndex(({ id }) => id === categoryId);
    const clone = categories.map((category) => ({ ...category }));
    const currentCategory = clone.splice(currentIndex, 1)[0];

    // 이동할 위치에 추가
    clone.splice(targetIndex, 0, { ...currentCategory });
    // sortNumber 재정렬
    clone.map((category, index) => ({ ...category, sortNumber: index + 1 }));

    return { categories: clone };
  };

  const { mutateAsync: handleUpdateCategorySort } = useMutation(
    (params: CategorySortParams) => {
      // const reorder = getReorderCategories(params);
      const reorder = getCacheCategories(params);
      const sortCategoryIds = reorder.categories.map(({ id }) => id);

      return updateCategorySort({ sortCategoryIds });
    },
    {
      onMutate: (params: CategorySortParams) => {
        const previous = getCacheCategories(params);
        const reorder = getReorderCategories(params);

        queryClient.setQueryData(getQueryKey(params), reorder);

        return { previous };
      },
      onSuccess: (data, variables) => {
        // console.log('handleUpdateCategorySort.onSuccess');
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(getQueryKey(variables), context?.previous);
      },
    },
  );

  return {
    handleUpdateCategorySort,
  };
};
