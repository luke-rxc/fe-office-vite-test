import { Box, Grid, Theme } from '@material-ui/core';
import { ReactNode } from 'react';
import DoubleArrowSharpIcon from '@material-ui/icons/DoubleArrowSharp';
import { SxProps } from '@material-ui/system';
import styled from '@emotion/styled';

interface Props {
  title: string | ReactNode;
  children: ReactNode;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export const Section = ({ title, action, children, ...props }: Props) => {
  return (
    <SectionWrapperStyled {...props}>
      <SectionInnerWrapperStyled container direction="row" justifyContent="space-between">
        <Grid item display="flex" alignItems="center" sx={{ fontSize: '1.25rem' }}>
          <DoubleArrowSharpIcon sx={{ mr: '10px' }} />
          {title}
        </Grid>
        <Grid item>{action && <span>{action}</span>}</Grid>
      </SectionInnerWrapperStyled>
      {children}
    </SectionWrapperStyled>
  );
};

const SectionWrapperStyled = styled(Box)`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  margin-top: 10px;
`;

const SectionInnerWrapperStyled = styled(Grid)`
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
`;
