import React, { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField as TextFieldMaterial } from '@material-ui/core';
import type { TextFieldProps } from '@material-ui/core';

/**
 * @deprecated
 */
export const TextField = memo(({ name, onChange, ...props }: TextFieldProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    const finalValue = props.type === 'number' ? +value : value;
    setValue(name, finalValue);
    onChange?.(evt);
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextFieldMaterial
            {...field}
            {...props}
            onChange={handleChange}
            /** @todo name 이 array 일때 체크 */
            error={!!errors[name] || !!props.error}
            helperText={errors[name] ? errors[name]?.message : props?.helperText}
          />
        );
      }}
    />
  );
});

TextField.displayName = 'TextField';
