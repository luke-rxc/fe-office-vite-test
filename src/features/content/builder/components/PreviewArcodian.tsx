import type { VFC } from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

type PreviewArcodianProps = {
  title: string;
  previewImage: string[];
};
export const PreviewArcodian: VFC<PreviewArcodianProps> = ({ title, previewImage }) => {
  return (
    <Accordion
      sx={{
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography color="primary" variant="subtitle1">
          <strong>{title}</strong> sample 보기
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {previewImage.map((img, index) => (
            <img
              key={index}
              width="300"
              src={`https://cdn-image.prizm.co.kr/${img}`}
              alt=""
              style={{ marginLeft: 20 }}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
