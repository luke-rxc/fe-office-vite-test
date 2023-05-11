import { Box, TextField, Chip } from '@material-ui/core';
import React from 'react';
import { useInputTag } from '../hooks';

interface Props {
  key?: string;
  width?: string | number;
  tags: Array<string>;
  onUpdateTags: (updateTags: Array<string>) => void;
  onDeleteTags: (updateTags: Array<string>) => void;
}

/**
 * input tag component
 */
export const InputTags: React.FC<Props> = ({ key = 'inputTags', width, ...props }: Props) => {
  const { tags } = props;
  const { inputValue, onChange, onKeyPress, onDelete, onBlur } = useInputTag(props);

  return (
    <Box {...(width && { width })}>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="입력후 `Enter`키를 누르세요."
        value={inputValue}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
      />
      <Box mt="20px">
        {tags.length > 0 &&
          tags.map((tag) => (
            <Chip
              key={`${key}-${tag}`}
              label={tag}
              variant="outlined"
              color="primary"
              sx={{ m: '0 10px 10px 0', fontSize: '14px' }}
              onDelete={onDelete(tag)}
            />
          ))}
      </Box>
    </Box>
  );
};
