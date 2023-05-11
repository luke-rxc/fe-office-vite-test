import React, { useMemo } from 'react';
import { ListItem, IconButton } from '@material-ui/core';
import { UploadFileInfo } from '@models/UploadModel';
import XIcon from '@assets/icons/X';
import { getCdnLink } from '@utils/link';

interface Props {
  fileInfo: UploadFileInfo;
  index?: number;
  onRemove: (index: number) => void;
}

export const DetailUploadList: React.FC<Props> = ({ fileInfo, index, onRemove }) => {
  const { path, originalFileName } = fileInfo;
  const linkHref = useMemo(() => getCdnLink(path), [path]);

  // remove
  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <ListItem
      sx={{
        height: 40,
        border: '1px solid rgba(0, 0, 0, 0.38)',
        borderRadius: '16px',
      }}
    >
      <a href={linkHref} target="_blank" rel="noreferrer">
        {originalFileName}
      </a>
      <IconButton size="small" sx={{ ml: 2 }} onClick={handleRemove}>
        <XIcon />
      </IconButton>
    </ListItem>
  );
};
