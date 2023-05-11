import React from 'react';
import { ListItemText, ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import { IconButton } from '@components/IconButton';

export interface IMoreMenuProps {
  items: { label: string | number; action: (event?: React.MouseEvent) => any; icon?: React.ReactNode }[];
}

export const MoreMenu: React.FC<IMoreMenuProps> = React.memo(({ items, children }) => {
  const anchorRef = React.useRef(null);
  const [isOpen, setOpenState] = React.useState(false);

  const handleOpen = () => {
    setOpenState(true);
  };

  const handleClose = () => {
    setOpenState(false);
  };

  return (
    <>
      <IconButton icon={<MoreVert />} title="더보기" ref={anchorRef} onClick={handleOpen} />
      <Menu
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        PaperProps={{ sx: { maxWidth: '100%' } }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {items.map(({ label, icon, action }) => (
          <MenuItem key={label} onClick={action}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={label} />
          </MenuItem>
        ))}
        {children}
      </Menu>
    </>
  );
});
