import styled from '@emotion/styled';
import { Chip } from '@material-ui/core';

interface Props {
  label: string;
  className: string;
}

export const StatusChip = ({ className, label }: Props) => {
  return <ChipStyled className={className} label={label} variant="outlined" size="small" color="primary" />;
};

const ChipStyled = styled(Chip)`
  &.wait,
  &.none {
    border-color: #6aa84f;
    color: #6aa84f;
  }
  &.live {
    border-color: #2e89ff;
    color: #2e89ff;
  }
  &.end {
    border-color: #999999;
    color: #999999;
  }
`;
