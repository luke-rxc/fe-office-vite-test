import { useCallback } from 'react';
import { Checkbox, ICheckboxProps } from '@components/Checkbox';
import { Controller, useFormContext, ControllerProps, FieldValues } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> & ICheckboxProps;

export const FormControlCheckbox = <T extends FieldValues>({ name, defaultValue, rules, ...props }: Props<T>) => {
  const { control } = useFormContext<T>();
  const renderCheckbox = useCallback(
    ({ field }) => {
      return <Checkbox {...field} {...props} checked={field.value} />;
    },
    [props],
  );
  return <Controller name={name} control={control} defaultValue={defaultValue} rules={rules} render={renderCheckbox} />;
};
