import type { FC, ReactElement, ReactNode } from 'react';
import { Button } from '@material-ui/core';
import type { ButtonProps } from '@material-ui/core';

interface CategoryCardActionProps extends ButtonProps {
  icon?: ReactElement;
  children?: ReactNode;
}

const CategoryCardAction: FC<CategoryCardActionProps> = (props) => {
  const { icon, children, ...other } = props;

  return (
    <Button
      color="primary"
      fullWidth
      startIcon={icon}
      sx={{
        justifyContent: 'flex-start',
        '& + &': {
          mt: 2,
        },
      }}
      variant="contained"
      {...other}
    >
      {children}
    </Button>
  );
};

export default CategoryCardAction;
