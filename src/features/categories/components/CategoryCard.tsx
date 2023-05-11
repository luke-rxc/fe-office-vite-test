import { forwardRef, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import PencilAltIcon from '@assets/icons/PencilAlt';
import EyeIcon from '@assets/icons/Eye';
import EyeOffIcon from '@assets/icons/EyeOff';
import type { CategorySchema } from '../schemas';
import CategoryCardModal from './CategoryCardModal';
import { useCategoryUpdateService } from '../services';

interface CategoryCardProps {
  category: CategorySchema;
  selected: boolean;
  dragging: boolean;
  index?: number;
  style?: Record<any, any>;
  onSelectCategory: (level: number, categoryId: number) => void;
}

const CategoryCard = forwardRef<HTMLDivElement, CategoryCardProps>(
  ({ category, selected, dragging, onSelectCategory, ...other }, ref) => {
    const { handleUpdateCategory } = useCategoryUpdateService({
      categoryId: category.id,
    });

    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
      setOpen(true);
    };

    const handleClose = (): void => {
      setOpen(false);
    };

    const handleClick = (): void => {
      onSelectCategory(category.level, category.id);
    };

    return (
      <Box ref={ref} sx={{ outline: 'none', py: 1 }} {...other}>
        <Card
          onClick={handleClick}
          raised={dragging}
          sx={{
            ...(selected && {
              backgroundColor: 'background.default',
            }),
            ...(dragging && {
              backgroundColor: 'background.paper',
            }),
            '@media (hover: hover)': {
              '&:hover': {
                backgroundColor: 'background.default',
              },
            },
          }}
          variant={dragging ? 'elevation' : 'outlined'}
        >
          <CardContent>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                '& svg:not(:first-of-type)': {
                  ml: 2,
                },
              }}
            >
              <Typography color="textPrimary" variant="subtitle2">
                {category.name}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              {category.isOpen ? <EyeIcon color="disabled" /> : <EyeOffIcon color="disabled" />}
              <PencilAltIcon fontSize="small" onClick={handleOpen} style={{ cursor: 'pointer' }} />
            </Box>
          </CardContent>
        </Card>
        <CategoryCardModal
          category={category}
          onUpdateCategory={handleUpdateCategory}
          onClose={handleClose}
          open={open}
        />
      </Box>
    );
  },
);

export default CategoryCard;
