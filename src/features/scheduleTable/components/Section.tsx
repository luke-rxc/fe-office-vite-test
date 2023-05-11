import { Box, Grid, Theme } from '@material-ui/core';
import { ReactNode } from 'react';
import DoubleArrowSharpIcon from '@material-ui/icons/DoubleArrowSharp';
import { SxProps } from '@material-ui/system';
import styled from '@emotion/styled';

interface Props {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export const Section = ({ title, action, children, ...props }: Props) => {
  return (
    <WrapperStyled {...props}>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ margin: '20px 0' }}>
        <DoubleArrowSharpIcon />
        <Grid item sx={{ ml: '10px', fontSize: '1.25rem' }}>
          {title}
        </Grid>
        <Grid item>{action && <span>{action}</span>}</Grid>
      </Grid>
      <ContentStyled>{children}</ContentStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)`
  margin: 10px 0;
  padding: 0;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 4px;
`;

const ContentStyled = styled(Box)`
  padding: 20px 0;
  border: 1px solid #0000001f;
  border-radius: 10px;
`;
