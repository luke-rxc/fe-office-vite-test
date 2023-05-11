import get from 'lodash/get';
import styled from '@emotion/styled';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import { ColorPicker, IColorPickerProps } from '@components/ColorPicker';

export type FormControlColorPickerProps<T> = Omit<ControllerProps<T>, 'render'> & IColorPickerProps;

/**
 * Controlled ColorPicker 컴포넌트
 *
 * @todo 추후 팀내 협의 후 공통 컴포넌트로 변경
 */
export const FormControlColorPicker = <T extends FieldValues>({
  defaultValue,
  name,
  rules,
  ...props
}: FormControlColorPickerProps<T>) => {
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
          <ColorPicker {...props} {...field} error={!!error} />
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
