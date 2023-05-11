import { Button } from '@material-ui/core';

interface Props {
  isEdit: boolean;
  size?: 'small' | 'medium' | 'large';
  onClickEdit: () => void;
  onCancelEdit: () => void;
  onClickSubmit: () => void;
}

/**
 * Edit Action component
 */
export const EditActions = ({
  isEdit,
  size,
  onClickEdit: handleClickEdit,
  onCancelEdit: handleCancelEdit,
  onClickSubmit: handleClickSubmit,
}: Props) => {
  if (!isEdit) {
    return (
      <Button key="btn-edit" variant="contained" size={size} onClick={handleClickEdit}>
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
      <Button key="btn-modify" variant="contained" size={size} onClick={handleClickSubmit}>
        저장
      </Button>
    </>
  );
};
