import { useState } from 'react';
import { Controller, ControllerProps, FieldValues, useFormContext } from 'react-hook-form';
import { Switch, SwitchProps } from '@material-ui/core';
import styled from '@emotion/styled';

type FormControlSwitchProps<T> = Omit<ControllerProps<T>, 'render'> &
  Omit<SwitchProps, 'defaultValue'> & {
    onChangeSwitch?: (e: any) => void;
  };

export const FormControlSwitch = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  onChangeSwitch,
  ...props
}: FormControlSwitchProps<T>) => {
  const { control } = useFormContext<T>();
  const [isCheck, setIsCheck] = useState<boolean>(defaultValue);
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <Switch
            checked={isCheck}
            onChange={(e) => {
              setIsCheck(e.target.checked);
              onChange(e.target.checked);
              onChangeSwitch && onChangeSwitch(e.target.checked);
            }}
            {...props}
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
