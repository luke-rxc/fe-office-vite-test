import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField, MenuItem } from '@material-ui/core';
import type { TextFieldProps } from '@material-ui/core';

interface SelectProps {
  name: string;
  options: unknown[];
  onValueChange?: (value: unknown) => void;
}

type Props = SelectProps & TextFieldProps;

/**
 * @deprecated
 * @see /components/GoodsCategory.tsx
 * @see /components/detailOption/DetailOptionTable.tsx
 */
export const Select = memo(({ name, options, onValueChange, ...props }: Props) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const handleChange = (evt) => {
    const { value } = evt.target;
    setValue(name, value);
    onValueChange?.(value);
  };
  const configSelect: TextFieldProps = {
    select: true,
    variant: 'outlined',
    error: !!errors[name],
    helperText: errors[name] ? errors[name]?.message : '',
    onChange: handleChange,
    ...props,
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField {...field} {...configSelect}>
          {options.map((item: { value: string; text?: string; label?: string }) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label ?? item.text}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
});

Select.displayName = 'Select';
