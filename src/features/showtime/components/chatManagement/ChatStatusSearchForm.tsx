import { KeyboardEvent } from 'react';
import { TOption } from '@components/Select';
import { ChatSearchType, ChatSearchTypeLabel } from '@features/showtime/constants';
import { ShowtimeChatStatusSearchFormField } from '@features/showtime/types';
import { Box, Button } from '@material-ui/core';
import { FormControlSelect, FormControlTextField } from '../form';
import { useFormContext } from 'react-hook-form';

interface Props {
  onClickSearch: () => void;
  onClickSearchClear: () => void;
}

const searchOptions: Array<TOption> = [
  { label: ChatSearchTypeLabel[ChatSearchType.NICKNAME], value: ChatSearchType.NICKNAME },
  { label: ChatSearchTypeLabel[ChatSearchType.MESSAGE], value: ChatSearchType.MESSAGE },
];

export const ChatStatusSearchForm = ({
  onClickSearch: handleClickSearch,
  onClickSearchClear: handleClickSearchClear,
}: Props) => {
  const { watch } = useFormContext<ShowtimeChatStatusSearchFormField>();
  const searched = watch('searched');

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClickSearchClear();
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClickSearch();
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '10px' }}>
      <FormControlSelect<ShowtimeChatStatusSearchFormField>
        name="searchType"
        options={searchOptions}
        sx={{ width: '160px' }}
        size="small"
      />
      <FormControlTextField<ShowtimeChatStatusSearchFormField>
        name="keyword"
        size="small"
        sx={{ width: '100%', margin: '0 10px' }}
        onKeyPress={handleKeyPress}
        onKeyUp={handleKeyUp}
      />
      <Button variant="contained" onClick={handleClickSearch}>
        검색
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ width: '110px', marginLeft: '10px' }}
        onClick={handleClickSearchClear}
        disabled={searched === 'N'}
      >
        전체보기
      </Button>
    </Box>
  );
};
