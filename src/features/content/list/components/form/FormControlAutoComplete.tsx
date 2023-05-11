import { Autocomplete, IAutocompleteProps } from '@components/Autocomplete';
import { Controller, useFormContext, ControllerProps, FieldValues } from 'react-hook-form';
import styled from '@emotion/styled';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  IAutocompleteProps & {
    onChangeAutoComplete?: (value) => void;
  };

export const FormControlAutoComplete = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  error = false,
  onChangeAutoComplete,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange, ...fields }, fieldState: { error } }) => (
        <>
          <Autocomplete
            onChange={(e) => {
              onChange(e);
              onChangeAutoComplete?.(e);
            }}
            error={!!error}
            {...props}
            {...fields}
          />
          {!!error && <ErrorMessageStyled>{error.message}</ErrorMessageStyled>}
        </>
      )}
    />
  );
};

const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
