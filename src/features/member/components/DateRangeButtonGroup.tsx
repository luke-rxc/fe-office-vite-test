import { Button, ButtonGroup, Theme } from '@material-ui/core';
import { SxProps } from '@material-ui/system';
import React from 'react';

interface Props {
  rangeDates?: Array<{ label: string; date: number }>;
  onChangeDateRange?: (range: number) => void;
  sx?: SxProps<Theme>;
}

const defaultRangeDates: Array<{ label: string; date: number }> = [
  { label: '오늘', date: 0 },
  { label: '3일', date: 3 },
  { label: '7일', date: 7 },
  { label: '30일', date: 30 },
  { label: '전체', date: -1 },
];

export const DateRangeButtonGroup = React.memo(
  ({ rangeDates, onChangeDateRange, sx }: Props) => {
    const onClickRange = (range: number) => {
      return onChangeDateRange ? () => onChangeDateRange(range) : undefined;
    };

    return (
      <ButtonGroup sx={{ alignSelf: 'flex-start', height: '56px', ...sx }}>
        {(rangeDates || defaultRangeDates).map(({ label, date }) => {
          return (
            <Button key={`button-date-range-${label}`} onClick={onClickRange(date)}>
              {label}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  },
  ({ rangeDates: prevRangeDates, sx: prevSx }, { rangeDates: nextRangeDates, sx: nextSx }) =>
    Object.is(prevRangeDates, nextRangeDates) && Object.is(prevSx, nextSx),
);
