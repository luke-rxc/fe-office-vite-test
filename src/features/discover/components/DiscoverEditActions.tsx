import { Button } from '@material-ui/core';

interface Props {
  isEdit: boolean;
  size?: 'small' | 'medium' | 'large';
  onEdit: () => void;
  onCancelEdit: () => void;
}

export const DiscoverEditActions = ({ isEdit, size, onEdit: handleEdit, onCancelEdit: handleCancelEdit }: Props) => {
  if (!isEdit) {
    return (
      <Button key="btn-edit" variant="contained" size={size} onClick={handleEdit}>
        편집
      </Button>
    );
  }

  return (
    <>
      <Button
        key="btn-cancel"
        variant="contained"
        color="secondary"
        size={size}
        sx={{ mr: '10px' }}
        onClick={handleCancelEdit}
      >
        취소
      </Button>
      <Button type="submit" key="btn-modify" variant="contained" size={size}>
        저장
      </Button>
    </>
  );
};
