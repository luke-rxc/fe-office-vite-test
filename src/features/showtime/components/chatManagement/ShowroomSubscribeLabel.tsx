import { Grid } from '@material-ui/core';
import { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

/**
 * 쇼룸구독요청 Label component
 */
export const ShowroomSubscribeLabel = ({ label, children }: Props) => {
  return (
    <Grid container spacing="20px" p="10px 0">
      <Grid item display="flex" alignItems="center" sx={{ width: '100px' }}>
        {label}
      </Grid>
      <Grid item>{children}</Grid>
    </Grid>
  );
};
