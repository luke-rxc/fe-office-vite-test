import { Box, Grid, Theme } from '@material-ui/core';
import { ReactNode } from 'react';
import DoubleArrowSharpIcon from '@material-ui/icons/DoubleArrowSharp';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { SxProps } from '@material-ui/system';
import styled from '@emotion/styled';
import { isUndefined } from '@utils/type';
import { SectionType } from '../constants';

interface Props {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  type?: SectionType;
  sx?: SxProps<Theme>;
}

export const Section = ({ title, action, type = SectionType.MAIN, children, ...props }: Props) => {
  return (
    <WrapperStyled type={type} {...props}>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ mb: '20px' }}>
        {type === SectionType.MAIN ? <DoubleArrowSharpIcon /> : <ArrowRight />}
        <TitleStyled item type={type}>
          {title}
        </TitleStyled>
        <Grid item sx={{ ml: 'auto' }}>
          {!isUndefined(action) && action}
        </Grid>
      </Grid>
      {children}
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)<{ type: Props['type'] }>`
  margin-bottom: ${({ type }) => (type === SectionType.MAIN ? '20px' : '10px')};
  padding: ${({ type }) => (type === SectionType.MAIN ? '20px' : '10px')};
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 4px;
`;

const TitleStyled = styled(Grid)<{ type: Props['type'] }>`
  margin-left: 10px;
  font-size: ${({ type }) => (type === SectionType.MAIN ? '1.25rem' : '1rem')};
`;
