import { Controller, useFormContext, ControllerProps, FieldValues } from 'react-hook-form';
import styled from '@emotion/styled';
import { Select, ISelectProps } from '@components/Select';

export type FormControlSelectProps<T> = Omit<ControllerProps<T>, 'render'> &
  ISelectProps & {
    onChangeSelect?: (e) => void;
  };

export const FormControlSelect = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  onChangeSelect,
  ...props
}: FormControlSelectProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange, ...fields }, fieldState: { error } }) => (
        <>
          <Select
            onChange={(event) => {
              onChange(event);
              onChangeSelect && onChangeSelect(event);
            }}
            {...props}
            {...fields}
            error={!!error}
          />
          {!!error && <ErrorMessageStyled>{error?.message ?? ''}</ErrorMessageStyled>}
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
