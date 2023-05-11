import { useQueryClient } from 'react-query';
import { useMutation } from '@hooks/useMutation';
import { createCategoryRoot, createCategoryChildren } from '../apis';

export const useCategoryCreateService = () => {
  const queryClient = useQueryClient();

  const { mutate: onCreateCategoryRoot } = useMutation(createCategoryRoot, {
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const { mutate: onCreateCategoryChildren } = useMutation(
    ({ name, parentCategoryId }: { name: string; parentCategoryId: number }) =>
      createCategoryChildren(parentCategoryId, { name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  );

  const handleCreateCategory = (name: string, parentCategoryId?: number) => {
    !parentCategoryId ? onCreateCategoryRoot({ name }) : onCreateCategoryChildren({ name, parentCategoryId });
  };

  return {
    handleCreateCategory,
  };
};
