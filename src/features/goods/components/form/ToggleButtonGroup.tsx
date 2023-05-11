import { MouseEvent } from 'react';
import { ToggleButton, ToggleButtonGroup as ToggleButtonGroupMaterial } from '@material-ui/core';
import type { ToggleButtonGroupProps } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';

interface Props extends ToggleButtonGroupProps {
  name: string;
  options: { label: string; value: string }[];
}

export const ToggleButtonGroup = ({ name, options, onChange, ...props }: Props) => {
  const { control, setValue } = useFormContext();
  const handleChange = (event: MouseEvent<HTMLElement>, value: string) => {
    if (value !== null) {
      setValue(name, value);
      onChange?.(event, value);
    }
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ToggleButtonGroupMaterial {...field} {...props} onChange={handleChange}>
          {options.map(({ label, value }) => (
            <ToggleButton id={value} value={value} aria-label={value} key={value}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroupMaterial>
      )}
    />
  );
};
