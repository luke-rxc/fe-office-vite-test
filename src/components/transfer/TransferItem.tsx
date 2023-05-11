import React from 'react';
import { ListItem as ListItemMaterial, ListItemIcon, ListItemText, Checkbox } from '@material-ui/core'; // prettier-ignore

/** interface for ListItem */
export interface ITransferItemProps {
  value: string | number;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * 리스트 아이템 컴포넌트
 */
export const TransferItem: React.FC<ITransferItemProps> = ({
  value,
  label,
  disabled,
  checked = false,
  onClick: handleClick,
}) => (
  <ListItemMaterial button disabled={disabled} onClick={handleClick}>
    <ListItemIcon>
      <Checkbox
        disableRipple
        tabIndex={-1}
        value={value}
        checked={checked}
        disabled={disabled}
        inputProps={{ 'aria-labelledby': `${value}-${label}` }}
      />
    </ListItemIcon>
    <ListItemText id={`${value}-${label}`} primary={label} />
  </ListItemMaterial>
);
