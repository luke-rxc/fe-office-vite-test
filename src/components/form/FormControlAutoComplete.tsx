import { useCallback } from 'react';
import { Autocomplete, IAutocompleteProps } from '@components/Autocomplete';
import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues, FieldError } from 'react-hook-form';
import get from 'lodash/get';

export type Props<T> = Omit<ControllerProps<T>, 'render'> &
  IAutocompleteProps & {
    /**
     * 선택 한계여부
     */
    isLimit?: boolean;
  };

export const FormControlAutoComplete = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  isLimit = false,
  ...props
}: Props<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name) as FieldError;
  const renderAutocomplete = useCallback(
    ({ field }) => {
      return (
        <AutocompleteStyled limit={isLimit ? 'limit' : undefined}>
          <Autocomplete {...field} {...props} error={!!error} />
          {!!error && <ErrorMessageStyled>{error.message}</ErrorMessageStyled>}
        </AutocompleteStyled>
      );
    },
    [props, isLimit, error],
  );
  return (
    <Controller name={name} control={control} defaultValue={defaultValue} rules={rules} render={renderAutocomplete} />
  );
};

const AutocompleteStyled = styled(Box)<{ limit: string }>`
  width: 100%;

  & .MuiAutocomplete-tag.MuiChip-root.Mui-disabled {
    opacity: 1;
  }

  ${({ limit }) =>
    limit &&
    `

    & .MuiAutocomplete-input {
      pointer-events: none;
      cursor: default;
    }

    & .MuiAutocomplete-popupIndicator {
      pointer-events: none;
      opacity: 0.38;
    }
  `}
`;

const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
