import React from 'react';
import { Switch as SwitchMaterial, SwitchProps, FormControlLabel } from '@material-ui/core';

export interface ISwitchProps extends SwitchProps {
  label?: string;
}

/**
 * Material Switch와 FormControlLabel을 하나의 컴포넌트로 만든 Switch 컴포넌트
 *
 * @link https://next.material-ui.com/components/switches/#switch-with-formcontrollabel
 * @example
 * ```
 * import { Switch, ISwitchProps } from '../components/Switch';
 * <Switch
 *   checked={false}
 *   onChange={() => { }}
 *   name="checkedB"
 *   color="primary"
 *   label="화면에 표시할 텍스트"
 * />
 * ```
 */

export const Switch = React.forwardRef<HTMLInputElement, ISwitchProps>(({ label = '', ...props }, ref) => {
  return <FormControlLabel label={label} control={<SwitchMaterial {...props} ref={ref} />} />;
});
