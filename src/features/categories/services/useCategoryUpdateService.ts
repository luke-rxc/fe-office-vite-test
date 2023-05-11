import { useQueryClient } from 'react-query';
import { useMutation } from '@hooks/useMutation';
import { updateCategoryDetail, updateCategoryDetailParams } from '../apis';

interface CategoryUpdateProps {
  categoryId: number;
}

export const useCategoryUpdateService = ({ categoryId }: CategoryUpdateProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdateCategory } = useMutation(
    (params: updateCategoryDetailParams) => updateCategoryDetail(categoryId, params),
    {
      onSuccess: () => queryClient.invalidateQueries(),
    },
  );

  return {
    handleUpdateCategory,
  };
};
