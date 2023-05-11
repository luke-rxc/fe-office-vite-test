import { Box, Grid, Theme } from '@material-ui/core';
import { ReactNode } from 'react';
import DoubleArrowSharpIcon from '@material-ui/icons/DoubleArrowSharp';
import { SxProps } from '@material-ui/system';

interface Props {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export const Section = ({ title, action, children, ...props }: Props) => {
  return (
    <Box sx={{ backgroundColor: '#ffffff', p: '10px 20px', borderRadius: '4px', my: '10px' }} {...props}>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ margin: '20px 0' }}>
        <DoubleArrowSharpIcon />
        <Grid item sx={{ ml: '10px', fontSize: '1.25rem' }}>
          {title}
        </Grid>
        <Grid item>{action && <span>{action}</span>}</Grid>
      </Grid>
      {children}
    </Box>
  );
};
