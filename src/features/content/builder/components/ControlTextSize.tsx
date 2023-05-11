import { FieldValues } from 'react-hook-form';
import { TEXT_ITEM_SIZE_TYPE_OPTIONS } from '../constants';
import { FormControlSelect, FormControlSelectProps } from './form/FormControlSelect';

/**
 * 텍스트 사이즈
 */
export type ControlTextSizeProps<T> = FormControlSelectProps<T>;

export const ControlTextSize = <T extends FieldValues>({
  name,
  defaultValue,
  sx,
  ...props
}: ControlTextSizeProps<T>) => {
  return (
    <FormControlSelect
      defaultValue={defaultValue}
      name={name}
      label="텍스트 사이즈"
      size="small"
      options={TEXT_ITEM_SIZE_TYPE_OPTIONS}
      displayEmpty
      sx={{ width: 150 }}
      {...props}
    ></FormControlSelect>
  );
};
