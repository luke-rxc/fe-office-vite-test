import React from 'react';
import { Autocomplete as AutocompleteMaterial, AutocompleteProps, TextField, TextFieldProps } from '@material-ui/core';

type TAutocompleteOriginProps = AutocompleteProps<any, boolean | undefined, boolean | undefined, boolean | undefined>;

export interface IAutocompleteProps<T = any>
  extends Omit<TAutocompleteOriginProps, 'renderInput' | 'onChange'>,
    Pick<TextFieldProps, 'variant' | 'label' | 'placeholder' | 'InputLabelProps'> {
  error?: boolean;
  required?: boolean;
  helperText?: React.ReactNode;
  renderInput?: TAutocompleteOriginProps['renderInput'];
  onChange?: (value: T) => void;
}

/**
 * 자동완성입력필드 컴포넌트
 *
 * @link https://next.material-ui.com/api/autocomplete/
 * @example
 * ```
 * <Autocomplete
 *   multiple
 *   id="tags-outlined"
 *   options={top100Films}
 *   getOptionLabel={(option) => option.title}
 *   defaultValue={[top100Films[13]]}
 *   filterSelectedOptions
 *   variant="outlined"
 *   label="입점사"
 *   placeholder="+추가"
 * />
 * ```
 */
export const Autocomplete = React.forwardRef<HTMLElement, IAutocompleteProps>(
  (
    { variant, label, placeholder, renderInput, onChange, error, helperText, required, InputLabelProps, ...props },
    ref,
  ) => {
    const handleChange = (event: React.SyntheticEvent<Element, Event>, value: any) => {
      onChange && onChange(value);
    };

    return (
      <AutocompleteMaterial
        filterSelectedOptions
        ref={ref}
        onChange={handleChange}
        renderInput={
          renderInput ||
          ((params) => (
            <TextField
              {...params}
              required={required}
              label={label}
              error={error}
              variant={variant}
              helperText={helperText}
              placeholder={placeholder}
              InputLabelProps={InputLabelProps}
            />
          ))
        }
        {...props}
      />
    );
  },
);
