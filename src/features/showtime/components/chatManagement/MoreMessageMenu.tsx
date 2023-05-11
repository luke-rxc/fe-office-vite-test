import MoreHoriz from '@material-ui/icons/MoreHoriz';
import { IconButton } from '@components/IconButton';
import { SendBirdUserMessageModel } from '@features/showtime/models';
import { MenuItemOption } from '@features/showtime/types';
import { Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';

interface Props {
  chatItem: SendBirdUserMessageModel;
  getMenuItems: (chatItem: SendBirdUserMessageModel) => Array<MenuItemOption>;
}

export const MoreMessageMenu = ({ chatItem, getMenuItems }: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItems, setMenuItems] = useState<Array<MenuItemOption>>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setMenuItems(getMenuItems(chatItem));
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuItems(null);
  };

  const onAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <div>
      <IconButton icon={<MoreHoriz />} title="더보기" ref={anchorEl} onClick={handleClick} sx={{ padding: 0 }} />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems &&
          menuItems.map(({ label, action }) => (
            <MenuItem key={`${chatItem.messageId}-${label}`} onClick={() => onAction(action)}>
              {label}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};
