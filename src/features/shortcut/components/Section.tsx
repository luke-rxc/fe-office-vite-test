import { Box, Grid, Theme } from '@material-ui/core';
import { ReactNode } from 'react';
import DoubleArrowSharpIcon from '@material-ui/icons/DoubleArrowSharp';
import { SxProps } from '@material-ui/system';

interface Props {
  title: string | ReactNode;
  children: ReactNode;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export const Section = ({ title, action, children, ...props }: Props) => {
  return (
    <Box sx={{ backgroundColor: '#ffffff', p: '20px 20px', borderRadius: '16px', my: '10px' }} {...props}>
      <Grid container direction="row" justifyContent="space-between" sx={{ margin: '0 0 20px' }}>
        <Grid item display="flex" alignItems="center" sx={{ fontSize: '1.25rem' }}>
          <DoubleArrowSharpIcon sx={{ mr: '10px' }} />
          {title}
        </Grid>
        <Grid item>{action && <span>{action}</span>}</Grid>
      </Grid>
      {children}
    </Box>
  );
};
