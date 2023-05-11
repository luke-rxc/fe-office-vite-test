import get from 'lodash/get';
import styled from '@emotion/styled';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import { FileField, FileFieldProps } from './FileField';

export type FormControlFileFieldProps<T> = Omit<ControllerProps<T>, 'render'> & FileFieldProps;

/**
 * Controlled FileField 컴포넌트
 */
export const FormControlFileField = <T extends FieldValues>({
  name,
  rules,
  defaultValue,
  onChange,
  ...props
}: FormControlFileFieldProps<T>) => {
  const { control, formState } = useFormContext<T>();
  const error = get(formState?.errors, name) as FieldError;

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => {
        const handleChange = (value: FileFieldProps['fileInfos']) => {
          field.onChange(value);
          onChange && onChange(value);
        };

        return (
          <>
            <FileField fileInfos={field.value} onChange={handleChange} {...props} error={!!error} />
            {!!error && <ErrorMessageStyled>{error.message}</ErrorMessageStyled>}
          </>
        );
      }}
    />
  );
};

const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
