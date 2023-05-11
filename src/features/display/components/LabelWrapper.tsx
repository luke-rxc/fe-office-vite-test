import { Grid } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  label: string;
  height?: string | number;
  children: ReactNode;
  required: boolean;
}

export const LabelWrapper = ({ label, children, height = '6rem', required }: Props) => {
  return (
    <Grid container alignItems="center" spacing={1} sx={{ height }}>
      <Grid item xs={1} sx={{ textAlign: 'center', ' > em': { color: 'red' } }}>
        {label}
        {required && <em>*</em>}
      </Grid>

      <Grid item xs={11}>
        {children}
      </Grid>
    </Grid>
  );
};
