import { Checkbox, ICheckboxProps } from '@components/Checkbox';
import { Controller, useFormContext, ControllerProps, FieldValues } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  ICheckboxProps & {
    error?: boolean;
  };

export const FormControlCheckbox = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  error = false,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => <Checkbox size="small" {...props} {...field} checked={field.value} />}
    />
  );
};
