import { KeyboardEvent } from 'react';
import { Box, TextField, TextFieldProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError, useWatch } from 'react-hook-form';
import get from 'lodash/get';
import styled from '@emotion/styled';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  TextFieldProps & {
    /**
     * 엔터키 press시 submit trigger 사용여부
     */
    triggerPressEnterSubmit?: boolean;
    showLength?: boolean;
    maxLength?: number;
  };

export const FormControlTextField = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  triggerPressEnterSubmit = false,
  showLength = false,
  maxLength,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name) as FieldError;
  const value = useWatch({ name });

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
      render={({ field: { ref, ...field } }) => (
        <WrapperStyled className={props.fullWidth ? 'full-width' : ''}>
          <TextField
            variant="outlined"
            inputRef={ref}
            {...props}
            {...field}
            error={!!error}
            helperText={error?.message ?? ''}
            onKeyPress={onKeyPress}
            onBlur={props.onBlur}
            inputProps={{ ...props.inputProps, ...(maxLength ? { maxLength } : null) }}
          />
          {showLength && (
            <Box className="length">
              {String(value).length}
              {maxLength ? `/${maxLength}` : ''}
            </Box>
          )}
        </WrapperStyled>
      )}
    />
  );
};

const WrapperStyled = styled(Box)`
  position: relative;
  display: inline-block;

  &.full-width {
    display: block;
    width: 100%;
  }

  .length {
    position: absolute;
    top: 20px;
    right: 20px;
    color: ${({ theme }) => theme.palette.grey[700]};
  }
`;
