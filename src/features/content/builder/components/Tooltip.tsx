import type { VFC, ReactNode } from 'react';
import { Box, Tooltip as TooltipMaterial } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

/**
 * 툴팁
 */
type TooltipProps = {
  text: ReactNode;
};
export const Tooltip: VFC<TooltipProps> = ({ text }) => {
  const useStylesTooltip = makeStyles((theme) => ({
    arrow: {
      color: theme.palette.common.black,
    },
    tooltip: {
      backgroundColor: theme.palette.common.black,
    },
  }));
  const classes = useStylesTooltip();

  return (
    <TooltipMaterial
      arrow
      classes={classes}
      title={
        <Box p={1} sx={{ fontSize: 14 }}>
          {text}
        </Box>
      }
    >
      <HelpOutlineIcon />
    </TooltipMaterial>
  );
};
