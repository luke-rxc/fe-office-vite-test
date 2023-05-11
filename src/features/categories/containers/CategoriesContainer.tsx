import { DragDropContext } from 'react-beautiful-dnd';
import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { CategoriesLayout, CategoriesColumn } from '../components';
import { useCategoriesService } from '../services';

export const CategoriesContainer = () => {
  const theme = useTheme();
  const { categorizations, getSelectedParentId, handleSelectCategory, handleDragEnd } = useCategoriesService();

  const locations = [{ path: '/categories', text: '카테고리' }, { text: '카테고리 관리' }];

  return (
    <CategoriesLayout title="카테고리 관리" locations={locations}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            flexShrink: 1,
            [theme.breakpoints.down('lg')]: {
              justifyContent: 'flex-start',
            },
            [theme.breakpoints.up('lg')]: {
              justifyContent: 'center',
            },
            overflowX: 'auto',
            overflowY: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              px: 1,
              py: 3,
            }}
          >
            {categorizations.map((categorization) => (
              <CategoriesColumn
                key={categorization.level}
                categorization={categorization}
                parentId={getSelectedParentId(categorization.level)}
                onSelectCategory={handleSelectCategory}
              />
            ))}
          </Box>
        </Box>
      </DragDropContext>
    </CategoriesLayout>
  );
};
