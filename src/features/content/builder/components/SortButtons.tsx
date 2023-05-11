import { useCallback } from 'react';
import type { VFC } from 'react';
import { Box, Grid } from '@material-ui/core';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import FirstPage from '@material-ui/icons/FirstPage';
import { IconButton } from '@components/IconButton';
import { SORT_TYPE } from '../constants';

type SortButtonsProps = {
  onSort: (sortType: SORT_TYPE) => void; // 컴포넌트 정렬
};
export const SortButtons: VFC<SortButtonsProps> = ({ onSort }) => {
  const handleSort = useCallback(
    (sortType: SORT_TYPE) => {
      onSort(sortType);
    },
    [onSort],
  );
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            icon={<FirstPage />}
            title="맨 위로"
            sx={{ transform: 'rotate(90deg)' }}
            onClick={() => handleSort(SORT_TYPE.TOP)}
          />
        </Grid>
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton icon={<KeyboardArrowUp />} title="위로" onClick={() => handleSort(SORT_TYPE.UP)} />
        </Grid>
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton icon={<KeyboardArrowDown />} title="아래로" onClick={() => handleSort(SORT_TYPE.DOWN)} />
        </Grid>
        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            icon={<FirstPage />}
            title="맨 아래로"
            sx={{ transform: 'rotate(270deg)' }}
            onClick={() => handleSort(SORT_TYPE.BOTTOM)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
