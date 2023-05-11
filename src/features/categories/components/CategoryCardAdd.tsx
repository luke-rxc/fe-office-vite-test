import { useState } from 'react';
import type { FC, ChangeEvent, KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, TextField } from '@material-ui/core';
import { CategoryCreateMessage } from '../models';

interface CategoryCardAddProps {
  level: number;
  parentId?: number;
  onCreateCategory: (name: string, parentCategoryId?: number) => void;
}

const CategoryCardAdd: FC<CategoryCardAddProps> = ({ level, parentId, onCreateCategory: handleCreateCategory }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleAddOpen = (): void => {
    setIsExpanded(true);
  };

  const handleAddCancel = (): void => {
    setIsExpanded(false);
    setName('');
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.code === 'Enter') {
      handleAddConfirm();
    } else if (event.code === 'Escape') {
      handleAddCancel();
    }
  };

  const handleAddConfirm = (): void => {
    if (level > 1 && !parentId) {
      toast.error(CategoryCreateMessage.PARENT_CATEGORY_NOT_SELECTED);
      return;
    }

    try {
      handleCreateCategory(name, parentId);
      setIsExpanded(false);
      setName('');
      toast.success(CategoryCreateMessage.SUCCESS);
    } catch (err) {
      toast.error(CategoryCreateMessage.FAIL);
    }
  };

  return (
    <>
      {isExpanded ? (
        <>
          <TextField
            fullWidth
            label="카테고리 명"
            name="cardName"
            onKeyUp={handleKeyUp}
            onChange={handleChange}
            value={name}
            variant="outlined"
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
            <Button color="primary" onClick={handleAddCancel} variant="text">
              취소
            </Button>
            <Button color="primary" onClick={handleAddConfirm} variant="contained">
              확인
            </Button>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button color="primary" onClick={handleAddOpen} variant="text">
            카테고리 추가
          </Button>
        </Box>
      )}
    </>
  );
};

export default CategoryCardAdd;
