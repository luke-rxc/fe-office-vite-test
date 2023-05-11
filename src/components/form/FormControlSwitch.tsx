import React from 'react';
import { Typography, Switch, SwitchProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import styled from '@emotion/styled';
import get from 'lodash/get';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  SwitchProps & {
    label?: React.ReactNode;
    labelDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | 'inherit' | 'initial' | 'unset';
  };

export const FormControlSwitch = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  label,
  labelDirection,
  ...props
}: Props<T>) => {
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
      render={({ field }) => (
        <>
          <SwitchWrapper direction={labelDirection} error={!!error} disabled={props?.disabled}>
            <Switch {...props} {...field} onChange={field.onChange} checked={field.value} />
            {label && <Typography variant="caption" children={label} />}
          </SwitchWrapper>
          {error?.message && <ErrorMessageStyled>{error.message}</ErrorMessageStyled>}
        </>
      )}
    />
  );
};

const SwitchWrapper = styled.label<{ direction?: string; error?: boolean; disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  color: #6b778c;
  ${({ direction }) => direction && `flex-direction:${direction}`};
  ${({ error }) => error && `color: #f44336`};
  ${({ disabled }) => disabled && `color: rgba(0, 0, 0, 0.38);`};
`;

const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
