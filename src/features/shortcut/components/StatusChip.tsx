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
  &.before_open,
  &.admin_public {
    border-color: #6aa84f;
    color: #6aa84f;
  }
  &.open,
  &.public,
  &.normal {
    border-color: #2e89ff;
    color: #2e89ff;
  }
  &.finished,
  &.close,
  &.private,
  &.runout {
    border-color: #999999;
    color: #999999;
  }
  &.stop,
  &.unsold,
  &.publish_unable {
    border-color: #ff0000;
    color: #ff0000;
  }
  &.publish_able {
    border-color: #ff00ff;
    color: #ff00ff;
  }
`;
