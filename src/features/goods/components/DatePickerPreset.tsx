import React from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import type { SxProps } from '@material-ui/system';
import type { Theme } from '@material-ui/core';

interface Props {
  onDatePreset: (range?: number) => () => void;
  sx?: SxProps<Theme>;
}

export const DatePickerPreset: React.FC<Props> = ({ onDatePreset: handleDatePreset, sx }) => {
  return (
    <ButtonGroup sx={sx}>
      <Button children="전체" onClick={handleDatePreset()} />
      <Button children="오늘" onClick={handleDatePreset(0)} />
      <Button children=" 3일" onClick={handleDatePreset(3)} />
      <Button children=" 7일" onClick={handleDatePreset(7)} />
      <Button children="14일" onClick={handleDatePreset(14)} />
    </ButtonGroup>
  );
};
