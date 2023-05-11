import { KeyboardEvent, useState } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import InputMask from 'react-input-mask';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  TextFieldProps & {
    triggerPressEnterSubmit?: boolean;
  };

export const FormControlTimeTextField = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  triggerPressEnterSubmit = false,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useFormContext<T>();

  const error = errors[name] as FieldError;
  const [inputValue, setInputValue] = useState<string>(getValues(name));

  const onChange = ({ target: { value } }) => {
    setInputValue(value);

    setValue(name, value);

    if (error) {
      trigger(name);
    }
  };

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
      render={() => (
        <InputMask
          mask="99:99:99"
          value={inputValue}
          onChange={onChange}
          onBlur={onChange}
          placeholder="hh:mm:ss"
          maskChar=" "
        >
          {(inputProps: TextFieldProps) => (
            <TextField {...inputProps} error={!!error} helperText={error?.message ?? ''} onKeyPress={onKeyPress} />
          )}
        </InputMask>
      )}
    />
  );
};
