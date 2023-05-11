import { ShowtimeChatStatusMessageFormField } from '@features/showtime/types';
import { Box } from '@material-ui/core';
import { ReactNode } from 'react';
import { FormControlTextField } from '../form';

interface Props {
  children: ReactNode;
}

export const ChatStatusMessageForm = ({ children }: Props) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <FormControlTextField<ShowtimeChatStatusMessageFormField>
        name="message"
        size="small"
        sx={{ width: '100%', marginRight: '10px' }}
        triggerPressEnterSubmit
      />
      {children}
    </Box>
  );
};
