import { Select, TOption } from '@components/Select';
import { Box, Chip, MenuItem } from '@material-ui/core';
import React from 'react';
import { ShowtimeKeywordUpdateType } from '../constants';
import { KeywordComboItemModel } from '../models';

interface Props {
  key?: string;
  width?: string | number;
  keywords: Array<TOption>;
  options: Array<TOption>;
  onUpdateKeywords: (type: ShowtimeKeywordUpdateType, keywordItem: KeywordComboItemModel) => void;
  onDeleteKeywords: (type: ShowtimeKeywordUpdateType, keywordItem: KeywordComboItemModel) => void;
}

/**
 * select keyword component
 */
export const SelectKeywords: React.FC<Props> = ({
  key = 'SelectKeywords',
  width,
  keywords,
  options,
  onUpdateKeywords,
  onDeleteKeywords,
}: Props) => {
  const handleUpdateKeywords = (value: number) => {
    onUpdateKeywords(
      ShowtimeKeywordUpdateType.ADD,
      options.find((option) => option.value === value) as KeywordComboItemModel,
    );
  };

  return (
    <Box {...(width && { width })}>
      <Select options={options} onChange={(event) => handleUpdateKeywords(event.target.value as number)} displayEmpty>
        <MenuItem value="" disabled>
          키워드 선택
        </MenuItem>
      </Select>
      {keywords.length > 0 && (
        <Box mt="20px">
          {keywords.map((tag) => (
            <Chip
              key={`${key}-${tag.value}`}
              label={tag.label}
              variant="outlined"
              color="primary"
              sx={{ m: '0 10px 10px 0', fontSize: '14px' }}
              onDelete={() => onDeleteKeywords(ShowtimeKeywordUpdateType.DELETE, tag as KeywordComboItemModel)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
