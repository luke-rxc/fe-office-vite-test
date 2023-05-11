import { IRadioGroupProps, RadioGroup } from '@features/roles/components';
import { FormControlLabel, Radio } from '@material-ui/core';
import { Controller, ControllerProps, FieldValues, useFormContext } from 'react-hook-form';

type Props<T> = Omit<ControllerProps<T>, 'render'> &
  IRadioGroupProps & {
    options: Array<{
      label: string;
      value: string;
    }>;
  };

export const FormControlRadioGroup = <T extends FieldValues>({ name, options, ...props }: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      control={control}
      name={name}
      {...props}
      render={({ field }) => (
        <RadioGroup aria-label={name} {...field} name={name} row>
          {options.map((option) => (
            <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
          ))}
        </RadioGroup>
      )}
    />
  );
};
