import { ReactNode, useState } from 'react';
import { Controller, ControllerProps, FieldValues, useFormContext } from 'react-hook-form';
import { FormControlLabel, Radio, RadioGroup, RadioGroupProps } from '@material-ui/core';
import styled from '@emotion/styled';

export type FormControlRadioGroupProps<T> = Omit<ControllerProps<T>, 'render'> &
  RadioGroupProps & {
    options: Array<{
      label: string | ReactNode;
      value: string;
      labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
    }>;
    onChangeRadio?: (e: any) => void;
  };

export const FormControlRadioGroup = <T extends FieldValues>({
  name,
  defaultValue,
  options,
  onChangeRadio,
  rules,
  ...props
}: FormControlRadioGroupProps<T>) => {
  const { control } = useFormContext<T>();
  const [value, setValue] = useState<unknown>(defaultValue);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <RadioGroup
            aria-label={name}
            name={name}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              onChange(event);
              onChangeRadio && onChangeRadio(event);
            }}
            {...props}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                labelPlacement={option?.labelPlacement}
              />
            ))}
          </RadioGroup>
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
