import { Box, TextField, Button } from '@material-ui/core';
import { useMessageInput } from '../hooks';

interface Props {
  onSave?: (message: string) => void;
}

export const MessageInput = ({ onSave }: Props) => {
  const { message, handleUpdateMessage, handleSaveMessage } = useMessageInput();

  return (
    <Box display="flex" alignItems="center" gap="20px">
      <Box flex="1 0 auto">
        <TextField fullWidth size="small" onChange={handleUpdateMessage} value={message} />
      </Box>
      <Box>
        <Button type="button" variant="outlined" disabled={!message} onClick={handleSaveMessage(onSave)}>
          저장
        </Button>
      </Box>
    </Box>
  );
};
