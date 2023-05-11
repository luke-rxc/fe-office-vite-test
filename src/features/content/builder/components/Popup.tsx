import { useState } from 'react';
import type { FC } from 'react';
import { Box, Popover, PopoverProps, Typography } from '@material-ui/core';

type PopupProps = {
  title: string;
  popoverProps?: PopoverProps;
};
export const Popup: FC<PopupProps> = ({ title, children, popoverProps }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <Typography
        component="span"
        onClick={handleClick}
        color="primary"
        sx={{ fontSize: 14, fontWeight: 'bold', ml: 1, cursor: 'pointer' }}
      >
        {title}
      </Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        {...popoverProps}
      >
        <Box p={2}>{children}</Box>
      </Popover>
    </>
  );
};
