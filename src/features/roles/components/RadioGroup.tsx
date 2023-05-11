import React from 'react';
import {
  RadioGroup as RadioGroupMaterial,
  Radio,
  FormControlLabel,
  RadioGroupProps,
  FormControlLabelProps,
} from '@material-ui/core';

export interface IRadioProps extends Omit<FormControlLabelProps, 'value' | 'control'> {
  value: string | number;
}

export interface IRadioGroupProps extends RadioGroupProps {
  radios?: IRadioProps[];
  direction?:
    | 'row'
    | 'row-reverse'
    | 'column'
    | 'column-reverse'
    | 'nowrap'
    | 'wrap'
    | 'wrap-reverse'
    | 'row nowrap'
    | 'column wrap'
    | 'column-reverse wrap-reverse'
    | 'inherit'
    | 'initial'
    | 'unset';
}

export const RadioGroup = React.forwardRef<HTMLElement, IRadioGroupProps>(
  ({ radios = [], direction: flexFlow, children, ...props }, ref) => {
    return (
      <RadioGroupMaterial ref={ref} value={props.value} {...props} sx={{ flexFlow }}>
        {radios.map((radio, i) => (
          <FormControlLabel key={radio.value} {...radio} control={<Radio />} />
        ))}
        {children}
      </RadioGroupMaterial>
    );
  },
);
