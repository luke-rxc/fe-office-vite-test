import { DatePicker, IDatePickerProps } from '@components/DatePicker';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import get from 'lodash/get';

type Props<T> = Omit<ControllerProps<T>, 'render'> & IDatePickerProps;

export const FormControlDatePicker = <T extends FieldValues>({ name, defaultValue, rules, ...props }: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name) as FieldError;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => <DatePicker {...props} {...field} error={!!error} helperText={error?.message ?? ''} />}
    />
  );
};
