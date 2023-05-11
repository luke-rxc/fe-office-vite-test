import { Box, Button } from '@material-ui/core';
import React from 'react';

interface Props {
  value: string;
  onClickClipboardCopy: (value: string) => () => void;
}

export const ShowtimeManageStreamInfoItem: React.FC<Props> = ({
  value,
  onClickClipboardCopy: handleClickClipboardCopy,
}: Props) => {
  if (!value) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {value}
      <Button variant="contained" color="inherit" size="small" onClick={handleClickClipboardCopy(value)}>
        복사
      </Button>
    </Box>
  );
};
