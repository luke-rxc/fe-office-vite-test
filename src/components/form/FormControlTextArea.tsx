import styled from '@emotion/styled';
import { Box, TextareaAutosize, TextareaAutosizeProps } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError, useWatch } from 'react-hook-form';
import get from 'lodash/get';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  TextareaAutosizeProps & {
    width?: number | string;
    showLength?: boolean;
    maxLength?: number;
  };

export const FormControlTextArea = <T extends FieldValues>({
  name,
  defaultValue,
  showLength,
  maxLength,
  rules,
  width,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const error = get(errors, name) as FieldError;
  const value = useWatch({ name });

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <TextareaWrapperStyled width={width} error={!!error}>
          <WrapperStyled>
            <TextareaAutosize {...props} {...field} {...(maxLength ? { maxLength } : null)} />
            {showLength && (
              <Box className="length">
                {String(value).length}
                {maxLength ? `/${maxLength}` : ''}
              </Box>
            )}
          </WrapperStyled>
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

const WrapperStyled = styled(Box)`
  display: inline-block;
  position: relative;

  .length {
    position: absolute;
    bottom: 15px;
    right: 15px;
    color: ${({ theme }) => theme.palette.grey[700]};
  }
`;
