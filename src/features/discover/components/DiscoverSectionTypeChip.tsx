import styled from '@emotion/styled';
import { Chip } from '@material-ui/core';

interface Props {
  label: string;
  className: string;
}

export const DiscoverSectionTypeChip = ({ className, label }: Props) => {
  return <ChipStyled className={className} label={label} variant="filled" color="primary" />;
};

const ChipStyled = styled(Chip)`
  &.goods {
    background-color: #2e89ff;
  }
  &.showroom {
    background-color: #e06666;
  }
  &.story {
    background-color: #e69138;
  }
  &.live {
    background-color: #6aa84f;
  }
`;
