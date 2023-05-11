import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Box, Dialog, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import XIcon from '@assets/icons/X';
import CheckIcon from '@assets/icons/Check';
import type { CategorySchema } from '../schemas';
import CategoryCardAction from './CategoryCardAction';
import { CategoryUpdateMessage } from '../models';

interface Params {
  isOpen: boolean;
  name: string;
}

interface CategoryCardModalProps {
  category: CategorySchema;
  onUpdateCategory?: (params: Params) => void;
  onClose?: () => void;
  open: boolean;
}

const CategoryCardModal: FC<CategoryCardModalProps> = (props) => {
  const { category, onUpdateCategory, onClose, open, ...other } = props;

  const [name, setName] = useState<string>(category.name);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(category.isOpen);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeCategoryOpen = (event: ChangeEvent<{ value: number }>): void => {
    setIsCategoryOpen(Boolean(event.target.value));
  };

  const handleDetailsUpdate = async ({ isOpen, name }: { isOpen: boolean; name: string }) => {
    try {
      await onUpdateCategory({
        isOpen,
        name,
      });
      toast.success(CategoryUpdateMessage.SUCCESS);
      onClose();
    } catch (err) {
      toast.error(CategoryUpdateMessage.FAIL);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open} {...other}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              defaultValue={category.name}
              fullWidth
              label="카테고리 명"
              variant="outlined"
              onChange={handleChangeName}
            />
            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">공개 여부</InputLabel>
                <Select
                  labelId="category-open-select-label"
                  id="category-open-select"
                  value={Number(isCategoryOpen)}
                  label="공개 여부"
                  onChange={handleChangeCategoryOpen}
                >
                  <MenuItem value={1}>공개</MenuItem>
                  <MenuItem value={0}>비공개</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mt: 3 }}>
              {/* date 공통 함수 사용전 임시 적용 */}
              <TextField
                defaultValue={new Date(category.createDate).toLocaleString()}
                fullWidth
                label="생성일시"
                variant="outlined"
                disabled
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              {/* date 공통 함수 사용전 임시 적용 */}
              <TextField
                defaultValue={category.updateDate ? new Date(category.updateDate).toLocaleString() : '-'}
                fullWidth
                label="수정일시"
                variant="outlined"
                disabled
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CategoryCardAction
              icon={<CheckIcon fontSize="small" />}
              onClick={(): Promise<void> =>
                handleDetailsUpdate({
                  isOpen: isCategoryOpen,
                  name,
                })
              }
            >
              저장
            </CategoryCardAction>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CategoryCardAction icon={<XIcon fontSize="small" />} variant="outlined" onClick={onClose}>
              취소
            </CategoryCardAction>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default CategoryCardModal;
