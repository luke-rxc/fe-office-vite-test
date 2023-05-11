import type { VFC } from 'react';
import { Box, Button } from '@material-ui/core';
import { default as FileCopyIcon } from '@material-ui/icons/FileCopy';

/**
 * 링크 복사
 */
type ContentLinkCopyProps = {
  value: string;
  onClickClipboardCopy: (value: string) => () => void;
};

export const ContentLinkCopy: VFC<ContentLinkCopyProps> = ({ value, onClickClipboardCopy }: ContentLinkCopyProps) => {
  if (!value) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Button type="button" variant="text" size="small" onClick={onClickClipboardCopy(value)}>
        <FileCopyIcon fontSize="small" sx={{ marginRight: 1 }} />
        링크 복사: {value}
      </Button>
    </Box>
  );
};
