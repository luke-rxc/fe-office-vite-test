import { Select, ISelectProps } from '@components/Select';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> & ISelectProps;

export const FormControlSelect = <T extends FieldValues>({ name, defaultValue, rules, ...props }: Props<T>) => {
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
      render={({ field }) => <Select {...props} {...field} error={!!error} />}
    />
  );
};
