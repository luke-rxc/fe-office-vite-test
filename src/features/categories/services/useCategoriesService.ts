import { useState } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';

import { Categorization, CategoryMoveMessage } from '../models';
import { useCategorySortService } from './useCategorySortService';

export const useCategoriesService = () => {
  const { handleUpdateCategorySort } = useCategorySortService();

  const [categorizations, setCategorizations] = useState<Categorization[]>([
    {
      level: 1,
      name: '대분류',
      selectedId: null,
    },
    {
      level: 2,
      name: '중분류',
      selectedId: null,
    },
    {
      level: 3,
      name: '소분류',
      selectedId: null,
    },
  ]);

  const getSelectedParentId = (currentLevel: number): number | null => {
    const parentCategorization = categorizations.find(({ level }) => level === currentLevel - 1);

    return parentCategorization ? parentCategorization.selectedId : null;
  };

  const handleSelectCategory = (level: number, categoryId: number): void => {
    const isLastLevel = categorizations[categorizations.length - 1].level === level;

    if (isLastLevel) {
      return;
    }

    const selectedCategory = categorizations.map((categorization) => {
      const parent = categorization.level < level;
      const current = categorization.level === level;
      // 하위 카테고리 분류는 초기화
      const selectedId = parent ? categorization.selectedId : current ? categoryId : null;

      return { ...categorization, selectedId };
    });

    setCategorizations(selectedCategory);
  };

  const handleDragEnd = async ({ source, destination, draggableId }: DropResult): Promise<void> => {
    try {
      // 외부 영역
      if (!destination) {
        return;
      }

      // 이동하지 않음
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      // 다른 분류로 이동
      if (source.droppableId !== destination.droppableId) {
        toast.error(CategoryMoveMessage.WRONG);
        return;
      }

      try {
        const { id, level, parentId } = JSON.parse(draggableId);

        await handleUpdateCategorySort({
          categoryId: id,
          level,
          parentId,
          position: destination.index + 1,
        });

        toast.success(CategoryMoveMessage.SUCCESS);
      } catch (err) {
        console.error(err);
        toast.error(CategoryMoveMessage.FAIL);
      }
    } catch (err) {
      toast.error(CategoryMoveMessage.FAIL);
    }
  };

  return {
    categorizations,
    setCategorizations,
    getSelectedParentId,
    handleSelectCategory,
    handleDragEnd,
  };
};
