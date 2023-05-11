import { Autocomplete, IAutocompleteProps } from '@components/Autocomplete';
import { Controller, ControllerProps, FieldValues, useFormContext } from 'react-hook-form';

interface Props<T> extends Omit<ControllerProps<T>, 'render'>, Omit<IAutocompleteProps<T>, 'defaultValue' | 'ref'> {}

export const ControlledComboBox = <T extends FieldValues>({
  name,
  rules,
  defaultValue,
  shouldUnregister,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field }) => <Autocomplete {...field} {...props} />}
    />
  );
};
