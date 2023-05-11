import { DatePicker, IDatePickerProps } from '@components/DatePicker';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  IDatePickerProps & {
    onChangeDate?: (value) => void;
  };

export const FormControlDatePicker = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  onChangeDate,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name] as FieldError;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange: handleChange, ...rest } }) => (
        <DatePicker
          onChange={(value) => {
            handleChange(value);
            onChangeDate?.(value);
          }}
          {...props}
          {...rest}
          error={!!error}
          helperText={error?.message ?? ''}
        />
      )}
    />
  );
};
