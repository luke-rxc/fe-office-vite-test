import { Controller, useFormContext } from 'react-hook-form';
import { Radio as RadioMaterial } from '@material-ui/core';
import type { RadioProps } from '@material-ui/core';

interface RadioExtendProps {
  name: string;
  value: string;
  onValueChange?: (value: unknown) => void;
}

type Props = RadioProps & RadioExtendProps;

export const Radio = ({ name, value, onValueChange, ...props }: Props) => {
  const { control, setValue, getValues } = useFormContext();

  const handleChange = (evt) => {
    const { value } = evt.target;
    setValue(name, value);
    onValueChange?.(value);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RadioMaterial
          {...field}
          {...props}
          checked={value === getValues(name)}
          value={value}
          aria-label={name}
          name={name}
          onChange={handleChange}
        />
      )}
    />
  );
};
