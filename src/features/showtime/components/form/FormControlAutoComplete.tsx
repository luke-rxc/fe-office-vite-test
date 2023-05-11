import { Autocomplete, IAutocompleteProps } from '@components/Autocomplete';
import styled from '@emotion/styled-base';
import { Box } from '@material-ui/core';
import { Controller, useFormContext, ControllerProps, FieldValues } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> & IAutocompleteProps & { isLimit?: boolean };

export const FormControlAutoComplete = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  error = false,
  isLimit = false,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => (
        <AutocompleteStyled limit={isLimit ? 'limit' : undefined} sx={{ width: '100%' }}>
          <Autocomplete {...props} {...field} />
        </AutocompleteStyled>
      )}
    />
  );
};

const AutocompleteStyled = styled(Box)<{ limit: string }>`
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
