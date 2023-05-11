import styled from '@emotion/styled';
import { TextareaAutosize, TextareaAutosizeProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  TextareaAutosizeProps & {
    error?: boolean;
    width?: number | string;
  };

export const ControlledTextarea = <T extends FieldValues>({
  name,
  rules,
  defaultValue,
  shouldUnregister,
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
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <TextareaWrapperStyled width={width} error={!!error} disabled={props.disabled}>
          <TextareaAutosize {...props} {...field} />
          {!!error && <ErrorMessageStyled>{error?.message ?? ''}</ErrorMessageStyled>}
        </TextareaWrapperStyled>
      )}
    />
  );
};

const TextareaWrapperStyled = styled.div<{ width?: number | string; error: boolean; disabled: boolean }>`
  & textarea {
    box-sizing: border-box;
    padding: 10px;
    color: ${({ theme }) => (theme.palette.mode === 'light' ? '#000000' : '#ffffff')};
    font-size: 16px;
    font-family: inherit;
    border: 1px solid ${({ theme }) => (theme.palette.mode === 'light' ? '#0000003b' : '#ffffff3b')};
    background-color: ${({ theme }) => theme.palette.background.paper};

    &:hover {
      ${({ disabled, theme }) =>
        !disabled && `border: 1px solid ${theme.palette.mode === 'light' ? '#000000' : '#ffffff'};`}

      ${({ error }) => error && `border: 1px solid #f44336;`}
    }

    ${({ width }) => width && `width: ${width};`}

    ${({ error }) => error && `border: 1px solid #f44336;`}

    ${({ disabled, theme }) =>
      disabled &&
      `
      background-color: unset;
      color: ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.5)'};
      `}
  }
`;

const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
