import { KeyboardEvent } from 'react';
import { Controller, useFormContext, ControllerProps, FieldValues } from 'react-hook-form';
import { OutlinedInput, InputProps } from '@material-ui/core';
import styled from '@emotion/styled';

export type FormControlInputProps<T> = Omit<ControllerProps<T>, 'render'> &
  InputProps & {
    triggerPressEnterSubmit?: boolean;
    onChangeText?: (e: any) => void;
  };

export const FormControlInput = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  triggerPressEnterSubmit = false,
  multiline,
  onChangeText,
  ...props
}: FormControlInputProps<T>) => {
  const { control } = useFormContext<T>();

  const onKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!multiline && event.key === 'Enter' && !triggerPressEnterSubmit) {
      event.preventDefault();
    }

    props.onKeyPress && props.onKeyPress(event);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange, value, ...fields }, fieldState: { error } }) => (
        <>
          <OutlinedInput
            multiline={multiline}
            rows={multiline ? 4 : 1}
            error={!!error}
            onKeyPress={onKeyPress}
            onChange={(e) => {
              onChange(e);
              onChangeText && onChangeText(e.target.value);
            }}
            value={value}
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
