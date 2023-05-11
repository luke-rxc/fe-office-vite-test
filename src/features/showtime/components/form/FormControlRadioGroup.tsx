import { Box, FormControlLabel, Radio, RadioGroup, RadioGroupProps } from '@material-ui/core';
import { Controller, ControllerProps, FieldValues, useFormContext } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  RadioGroupProps & {
    options: Array<{
      label: string;
      value: string;
      disabled?: boolean;
    }>;
    sizes?: Array<number>;
    /** Display RadioGroup of elements in a compact row */
    row?: boolean;
    /** Disabled RadioGroup of all elements */
    disabled?: boolean;
  };

export const FormControlRadioGroup = <T extends FieldValues>({
  name,
  options,
  sizes,
  row = true,
  disabled = false,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      control={control}
      name={name}
      {...props}
      render={({ field }) => (
        <RadioGroup aria-label={name} {...field} {...props} name={name} row={row}>
          {options.map((option, index) => (
            <Box key={option.value} sx={{ width: sizes?.[index] ?? 'auto' }}>
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.label}
                disabled={disabled || option.disabled}
              />
            </Box>
          ))}
        </RadioGroup>
      )}
    />
  );
};
