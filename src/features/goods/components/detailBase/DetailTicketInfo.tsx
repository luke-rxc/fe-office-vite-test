import React from 'react';
import { Typography, Box } from '@material-ui/core';

interface Props {
  channel: string;
  typeName: string;
  period: string;
}

export const DetailTicketInfo: React.FC<Props> = ({ channel, typeName, period }) => {
  return (
    <Box>
      <Typography variant="body2" paragraph sx={{ marginBottom: 0 }}>
        채널 : {channel}
      </Typography>
      <Typography variant="body2" paragraph sx={{ marginBottom: 0 }}>
        타입 : {typeName}
      </Typography>
      <Typography variant="body2" paragraph sx={{ marginBottom: 0 }}>
        유효기간 : {period}
      </Typography>
    </Box>
  );
};
