import React from 'react';
import { Typography, Tooltip, TooltipProps, withStyles } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

interface Props {
  message: string;
  placement?: TooltipProps['placement'];
}

const DetailToolTipWrapper = withStyles({
  tooltip: {
    maxWidth: '500px',
    padding: '10px',
    borderRadius: 0,
  },
})(Tooltip);

export const DetailToolTip: React.FC<Props> = ({ message, placement = 'top-start' }) => {
  return (
    <DetailToolTipWrapper
      title={
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {message}
        </Typography>
      }
      children={<HelpIcon fontSize="small" sx={{ fill: '#999', width: '100%', height: '100%' }} />}
      placement={placement}
      arrow
    />
  );
};
