/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { Button, Menu, MenuItem } from '@material-ui/core';
import ChevronDownIcon from '@assets/icons/ChevronDown';
import { Checkbox } from '@components/Checkbox';

export interface IMultiSelectOption {
  label: string;
  value: string;
  readOnly?: boolean;
}

export interface IMultiSelectProps {
  label: React.ReactNode;
  readOnly?: boolean;
  options: IMultiSelectOption[];
  checkedValues?: string[];
  onChange?: (values: string[], changedOption: { value: string; label: string; isChecked: boolean }) => any;
}

/**
 * 멀티 셀렉터 컴포넌트
 */
export const MultiSelect: React.FC<IMultiSelectProps> = ({
  label,
  options,
  readOnly,
  checkedValues: originValues = [],
  onChange,
}) => {
  const anchorEl = React.useRef<HTMLButtonElement>(null);
  const prevOriginValues = React.useRef(null);
  const [isOpen, setOpenState] = React.useState(false);
  const [checkedValues, setCheckedValues] = React.useState<Map<number | string, boolean>>(
    originValues.reduce((map, value) => map.set(value, true), new Map()),
  );

  /**
   * 선택 메뉴 아이템 show
   */
  const handleOpenMenu = () => setOpenState(true);

  /**
   * 선택 메뉴 아이템 hide
   */
  const handleCloseMenu = () => setOpenState(false);

  /**
   * 메뉴 아이템 선택 토글
   */
  const handleChange = (option: IMultiSelectOption) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let newCheckedValues = new Map(checkedValues);
    const value = event.target.value;
    const isChecked = event.target.checked;

    isChecked ? newCheckedValues.set(value, true) : newCheckedValues.delete(value);
    setCheckedValues(newCheckedValues);

    if (onChange) {
      const values = [];

      for (let key of newCheckedValues.keys()) {
        values.push(key);
      }

      onChange(values, { ...option, isChecked });
    }
  };

  /**
   * props로 받은 checked value가 변경시 state 업데이트
   */
  React.useEffect(() => {
    if (!_isEqual(prevOriginValues.current, originValues)) {
      prevOriginValues.current = originValues;
      setCheckedValues(originValues.reduce((map, value) => map.set(value, true), new Map()));
    }
  }, [originValues]);

  return (
    <>
      <Button
        color="inherit"
        variant="text"
        ref={anchorEl}
        onClick={handleOpenMenu}
        endIcon={<ChevronDownIcon fontSize="small" />}
        children={label}
      />
      <Menu open={isOpen} anchorEl={anchorEl.current} onClose={handleCloseMenu}>
        {options.map((option) => (
          <MenuItem key={option.value}>
            <Checkbox
              value={option.value}
              label={option.label}
              disabled={option.readOnly || readOnly}
              checked={!!checkedValues.get(option.value)}
              onChange={handleChange(option)}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
