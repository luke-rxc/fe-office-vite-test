import { Select, ISelectProps } from '@components/Select';
import {
  Controller,
  useFormContext,
  ControllerProps,
  FieldValues,
  FieldError,
  ControllerRenderProps,
  Path,
} from 'react-hook-form';
import get from 'lodash/get';
import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  ISelectProps & {
    /**
     * 에러 노출여부
     */
    showError?: boolean;
  };

type SelectChangeEvent<T> = (
  event: React.ChangeEvent<{ name?: string; value: T; event: Event | React.SyntheticEvent }>,
  child: React.ReactNode,
  field: ControllerRenderProps<T, Path<T>>,
) => void;

export const FormControlSelect = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  showError = false,
  onChange: handleChange,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name) as FieldError;

  const onChangeSelect: SelectChangeEvent<T> = (event, child, field) => {
    field.onChange(event);
    handleChange?.(event, child);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => {
        const onChange: SelectInputProps<T>['onChange'] = (event, child) => onChangeSelect(event, child, field);

        return (
          <Box display="flex" flexDirection="column">
            <Select {...field} {...props} ref={field.ref} error={!!error} onChange={onChange} />
            {showError && !!error && <ErrorMessageStyled>{error.message ?? ''}</ErrorMessageStyled>}
          </Box>
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
