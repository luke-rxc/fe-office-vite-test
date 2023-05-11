import React from 'react';
import { Checkbox as CheckboxMaterial, CheckboxProps, FormControlLabel } from '@material-ui/core';

export interface ICheckboxProps extends CheckboxProps {
  label?: string;
}

/**
 * CheckBox 컴포넌트
 *
 * @link https://next.material-ui.com/components/checkboxes/#checkbox
 * @example
 * ```
 * <Checkbox id={id} label={label} onChange={() =>{}}/>
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, ICheckboxProps>(({ label = '', ...props }, ref) => {
  return <FormControlLabel label={label} control={<CheckboxMaterial ref={ref} {...props} />} />;
});
