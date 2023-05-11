import { ColorPicker, IColorPickerProps } from '@components/ColorPicker';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import get from 'lodash/get';
import { Box } from '@material-ui/core';
import styled from '@emotion/styled';

type Props<T> = Omit<ControllerProps<T>, 'render'> & Omit<IColorPickerProps, 'ref'> & {};

export const FormControlColorPicker = <T extends FieldValues>({
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
    <Controller
      name={name}
      rules={rules}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <Box>
          <ColorPicker fullWidth {...props} {...field} value={field.value as string} error={!!error} />
          {!!error && <ErrorMessageStyled>{error?.message ?? ''}</ErrorMessageStyled>}
        </Box>
      )}
    />
  );
};

const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
