import { KeyboardEvent } from 'react';
import { OutlinedInput, InputProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import styled from '@emotion/styled';
import get from 'lodash/get';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  InputProps & {
    /**
     * 엔터키 press시 submit trigger 사용여부
     */
    triggerPressEnterSubmit?: boolean;
  };

export const FormControlInput = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  triggerPressEnterSubmit = false,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name) as FieldError;

  const onKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !triggerPressEnterSubmit) {
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
      render={({ field }) => (
        <>
          <OutlinedInput {...props} {...field} error={!!error} onKeyPress={onKeyPress} />
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
