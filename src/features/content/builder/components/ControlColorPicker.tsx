import { Controller, ControllerProps, FieldValues, useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
import type { SxProps } from '@material-ui/system';
import type { Theme } from '@material-ui/core';
import { ColorPicker } from '@components/ColorPicker';

export type ControlColorPickerProps<T> = Omit<ControllerProps<T>, 'render'> & {
  name: string;
  defaultValue?: string;
  sx?: SxProps<Theme>;
  colorSize?: 'small' | 'medium';
  label?: string;
  onChange?: (value) => void;
};

export const ControlColorPicker = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  sx,
  colorSize = 'small',
  label = '색상',
  onChange: onChangeColor,
}: ControlColorPickerProps<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box sx={{ ...sx }}>
          <ColorPicker
            sx={{ width: 150 }}
            size={colorSize}
            label={label}
            onChange={(value) => {
              onChangeColor && onChangeColor(value);
              onChange(value);
            }}
            fullWidth
            value={value as string}
          />
          {!!error && <ErrorMessageStyled>{error?.message ?? ''}</ErrorMessageStyled>}
        </Box>
      )}
    />
  );
};
const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
