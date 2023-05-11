import { Box, TextField, TextFieldProps } from '@material-ui/core';
import { Controller, ControllerProps, FieldError, FieldValues, useFormContext } from 'react-hook-form';
import get from 'lodash/get';
import styled from '@emotion/styled';

type Props<T> = Omit<ControllerProps<T>, 'render'> & TextFieldProps;

export const ControlledText = <T extends FieldValues>({
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
  const error = get(errors, name) as FieldError;

  return (
    <WrapperStyled>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        shouldUnregister={shouldUnregister}
        render={({ field }) => (
          <TextField
            {...field}
            {...props}
            error={props.error || !!error}
            helperText={props.helperText || error?.message || ''}
          />
        )}
      />
    </WrapperStyled>
  );
};

const WrapperStyled = styled(Box)`
  .MuiInputLabel-root.Mui-error {
    color: #6b778c;
  }
`;
