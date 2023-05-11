import React from 'react';
import { FormControl, InputLabel, MenuItem, Select as SelectMaterial, SelectProps } from '@material-ui/core';

export type TOption = {
  value: string | number;
  label: string;
  readOnly?: boolean;
};
export interface ISelectProps extends SelectProps {
  /** select option item의 데이터 */
  options?: Array<TOption> | ReadonlyArray<TOption>;
}

/**
 * FormControl, Select, MenuItem으로 만든 Select 컴포넌트
 *
 * @link https://next.material-ui.com/components/selects/#select
 * @example
 * ```
 * import { Select, ISelectProps } from '../components/Select';
 * <Select
 *  id="uuid"
 *  label="화면에 표시할 레이블"
 *  options={searchSelectOptions}
 *  onChange={() => { }}
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, ISelectProps>((props, ref) => {
  const { id, sx, label, options, children, defaultValue = '', variant = 'outlined', ...restProps } = props;

  return (
    <FormControl fullWidth variant={variant} sx={sx}>
      {label && <InputLabel id={id}>{label}</InputLabel>}
      <SelectMaterial id={id} label={label} labelId={id} ref={ref} defaultValue={defaultValue} {...restProps}>
        {children}
        {options &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value} disabled={option.readOnly}>
              {option.label}
            </MenuItem>
          ))}
      </SelectMaterial>
    </FormControl>
  );
});
