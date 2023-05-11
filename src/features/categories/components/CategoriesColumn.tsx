import type { FC } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Divider, Paper, Typography } from '@material-ui/core';

import type { Categorization } from '../models';
import CategoryCard from './CategoryCard';
import CategoryCardAdd from './CategoryCardAdd';
import { useCategoryListService, useCategoryCreateService } from '../services';

interface CategoriesColumnProps {
  categorization: Categorization;
  parentId: number | null;
  onSelectCategory: (level: number, categoryId: number | null) => void;
}

const CategoriesColumn: FC<CategoriesColumnProps> = ({
  categorization,
  parentId,
  onSelectCategory: handleSelectCategory,
}) => {
  const { level: columnLevel, name: columnName, selectedId } = categorization;

  const { categories } = useCategoryListService(columnLevel, parentId);

  const { handleCreateCategory } = useCategoryCreateService();

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        height: '100%',
        mx: 1,
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: {
          xs: 300,
          sm: 380,
        },
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          px: 2,
          py: 2,
        }}
      >
        <Typography color="inherit" variant="h6">
          {columnName}
        </Typography>
      </Box>
      <Divider />
      <Droppable
        droppableId={`${columnLevel}`}
        // 추후 카테고리간 이동하는 경우를 위해 type은 동일하게 지정 (현재 droppable로 차단함)
        type="card"
      >
        {(provided): JSX.Element => (
          <Box
            ref={provided.innerRef}
            sx={{
              flexGrow: 1,
              minHeight: 80,
              overflowY: 'auto',
              px: 2,
              py: 1,
            }}
          >
            {categories &&
              categories.map((category, index) => (
                <Draggable
                  draggableId={JSON.stringify({
                    id: category.id,
                    level: category.level,
                    parentId: category.parentId,
                  })}
                  index={index}
                  key={category.id}
                >
                  {(_provided, snapshot): JSX.Element => (
                    <CategoryCard
                      category={category}
                      selected={category.id === selectedId}
                      onSelectCategory={handleSelectCategory}
                      dragging={snapshot.isDragging}
                      index={index}
                      key={category.id}
                      ref={_provided.innerRef}
                      style={{ ..._provided.draggableProps.style }}
                      {..._provided.draggableProps}
                      {..._provided.dragHandleProps}
                    />
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <Divider />
      <Box sx={{ p: 2 }}>
        <CategoryCardAdd level={columnLevel} parentId={parentId} onCreateCategory={handleCreateCategory} />
      </Box>
    </Paper>
  );
};

export default CategoriesColumn;
