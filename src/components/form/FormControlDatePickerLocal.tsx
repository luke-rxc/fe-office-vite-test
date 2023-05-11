import React, { KeyboardEvent } from 'react';
import { TextField as TextFieldMaterial, TextFieldProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import get from 'lodash/get';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  Omit<TextFieldProps, 'ref' | 'onChange'> & {
    triggerPressEnterSubmit?: boolean;
    onChange?: (timeValue: number) => void;
  };

export const FormControlDatePickerLocal = <T extends FieldValues>({
  name,
  rules,
  defaultValue,
  triggerPressEnterSubmit = false,
  onChange,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name) as FieldError;

  const onKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !triggerPressEnterSubmit) {
      event.preventDefault();
    }

    props.onKeyPress && props.onKeyPress(event);
  };
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <TextFieldMaterial
          type="datetime-local"
          variant="outlined"
          {...props}
          {...field}
          error={!!error}
          helperText={error?.message ?? ''}
          onKeyPress={onKeyPress}
        />
      )}
    />
  );
};
