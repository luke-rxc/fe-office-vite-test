import styled from '@emotion/styled';
import { TextareaAutosize, TextareaAutosizeProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  TextareaAutosizeProps & {
    error?: boolean;
    width?: number | string;
  };

export const FormControlTextArea = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  width,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name] as FieldError;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <TextareaWrapperStyled width={width} error={!!error}>
          <TextareaAutosize {...props} {...field} />
          {!!error && <ErrorMessageStyled>{error?.message ?? ''}</ErrorMessageStyled>}
        </TextareaWrapperStyled>
      )}
    />
  );
};

const TextareaWrapperStyled = styled.div<{ width?: number | string; error: boolean }>`
  & textarea {
    box-sizing: border-box;
    padding: 10px;
    color: ${({ theme }) => (theme.palette.mode === 'light' ? '#000000' : '#ffffff')};
    font-size: 16px;
    font-family: inherit;
    border: 1px solid ${({ theme }) => (theme.palette.mode === 'light' ? '#0000003b' : '#ffffff3b')};
    background-color: ${({ theme }) => theme.palette.background.paper};

    &:hover {
      border: 1px solid ${({ theme }) => (theme.palette.mode === 'light' ? '#000000' : '#ffffff')};

      ${({ error }) =>
        error &&
        `
      border: 1px solid #f44336;
    `}
    }

    ${({ width }) =>
      width &&
      `
      width: ${width};
    `}

    ${({ error }) =>
      error &&
      `
      border: 1px solid #f44336;
    `}
  }
`;

const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
