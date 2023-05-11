import { useState } from 'react';
import { Controller, ControllerProps, FieldValues, useFormContext } from 'react-hook-form';
import styled from '@emotion/styled';
import { Box, ToggleButton } from '@material-ui/core';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import type { SxProps } from '@material-ui/system';
import type { Theme } from '@material-ui/core';

export type ControlTextBoldProps<T> = Omit<ControllerProps<T>, 'render'> & {
  name: string;
  defaultValue?: boolean;
  sx?: SxProps<Theme>;
  onChange?: (value) => void;
};

export const ControlTextBold = <T extends FieldValues>({
  name,
  defaultValue,
  rules,
  sx,
  onChange: onChangeBold,
}: ControlTextBoldProps<T>) => {
  const [isBold, setIsBold] = useState<boolean>(defaultValue);
  const { control } = useFormContext<T>();

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Box sx={{ ...sx }}>
            <ToggleButton
              value={isBold}
              selected={isBold}
              size="small"
              onChange={() => {
                const value = !isBold;
                setIsBold(value);
                onChangeBold && onChangeBold(value);
                onChange(value);
              }}
            >
              <FormatBoldIcon />
            </ToggleButton>
            {!!error && <ErrorMessageStyled>{error?.message ?? ''}</ErrorMessageStyled>}
          </Box>
        )}
      />
    </>
  );
};
const ErrorMessageStyled = styled.div`
  margin: 3px 14px 0;
  color: #f44336;
  font-size: 0.75rem;
`;
