import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { GoodsRequestLogModel } from '../../models';

interface Props {
  logs: GoodsRequestLogModel[];
}

export const DetailRequestLog: React.FC<Props> = ({ logs }) => {
  const total = logs.length;
  return (
    <Accordion disabled={!total}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography color="primary" fontWeight={700} variant="subtitle1">
            <span>처리 내역 로그</span>
          </Typography>
          <Typography color="secondary" fontWeight={700} variant="body1">
            ({total} 건)
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {logs.map(({ id, dateText, message, processHandler }) => (
          <Box key={id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="primary" sx={{ mr: 1 }}>
              {dateText}
            </Typography>
            <Typography sx={{ mr: 1 }}>{message}</Typography>
            <Typography color="#f35958">{processHandler}</Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
