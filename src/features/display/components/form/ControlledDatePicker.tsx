import { DatePicker, IDatePickerProps } from '@components/DatePicker';
import { Controller, ControllerProps, FieldError, FieldValues, useFormContext } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> & IDatePickerProps & {};

export const ControlledDatePicker = <T extends FieldValues>({
  name,
  rules,
  defaultValue,
  shouldUnregister,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name] as FieldError;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field }) => <DatePicker {...field} {...props} error={!!error} helperText={error?.message || ''} />}
    />
  );
};
